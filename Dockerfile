# Etapa de build
FROM node:20-alpine AS builder

WORKDIR /app

# Instala git y openssh para clonar o manejar dependencias (si hace falta)
RUN apk add --no-cache git openssh

# Copia el código fuente al contenedor (incluye package.json)
COPY . .

# Instala dependencias y compila el proyecto
RUN npm install --include=dev
RUN npm run build

# Etapa final: usa nginx para servir la app
FROM nginx:alpine

# Copia los archivos ya compilados al directorio web de nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Configura nginx para SPA (Single Page Application)
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

CMD ["nginx", "-g", "daemon off;"]
