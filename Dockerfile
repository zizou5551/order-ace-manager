# Etapa de build
FROM node:20-alpine AS builder

WORKDIR /app

# Clona el código directamente (con acceso público o deploy key)
RUN apk add --no-cache git openssh


# Instala dependencias y compila
RUN npm install
RUN npm run build

# Etapa final: nginx
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# SPA fallback
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
