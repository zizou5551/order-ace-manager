# Etapa de build
FROM node:20-alpine AS builder

WORKDIR /app
COPY . .

# Instalación de dependencias y build
RUN npm install
RUN npm run build

# Etapa final: nginx para servir el frontend
FROM nginx:alpine

# Copia el contenido compilado al directorio de nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Configuración personalizada de nginx para SPA
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
