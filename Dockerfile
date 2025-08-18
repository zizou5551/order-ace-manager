# Etapa de build
FROM node:20-alpine AS builder

WORKDIR /app

# Instala Git (para clonar si lo necesitas)
RUN apk add --no-cache git

# Copia el package.json y el lock (si tenés)
COPY package.json package-lock.json* ./

# Instala TODAS las dependencias, incluidas dev (necesario para Vite)
RUN npm install --include=dev

# Copia el resto del código
COPY . .

# Compila la app
RUN npm run build

# Etapa final: nginx
FROM nginx:alpine

# Copia el resultado del build al contenedor de nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Configura nginx para SPA (Single Page App con fallback a index.html)
RUN rm /etc/nginx/conf.d/default.conf && \
    printf 'server {\n\
    listen 80;\n\
    server_name _;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    location / {\n\
      try_files $uri /index.html;\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80

# Arranca nginx
CMD ["nginx", "-g", "daemon off;"]
