# Etapa de build
FROM node:20-alpine AS builder

WORKDIR /app

# Instalamos Git por si tu código se clona desde GitHub
RUN apk add --no-cache git

# Copiamos y preparamos dependencias
COPY package.json package-lock.json* ./
RUN npm install

# Copiamos el resto del código
COPY . .

# Compilamos el frontend (esto genera la carpeta /app/dist)
RUN npm run build

# Etapa final: nginx
FROM nginx:alpine

# Copiamos el contenido compilado al directorio que nginx sirve
COPY --from=builder /app/dist /usr/share/nginx/html

# Reemplazamos la configuración de nginx con una para SPA (Single Page Application)
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

# Inicia nginx
CMD ["nginx", "-g", "daemon off;"]
