# --- Build (compila Vite) ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci || npm install
COPY . .
RUN npm run build

# --- Serve (sirve estático con Nginx) ---
FROM nginx:alpine
# Copia el build a la carpeta pública de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html
# SPA fallback: todas las rutas van a index.html
RUN printf 'server {\n\
  listen 80;\n\
  server_name _;\n\
  root /usr/share/nginx/html;\n\
  index index.html;\n\
  location / {\n\
    try_files $uri /index.html;\n\
  }\n\
}\n' > /etc/nginx/conf.d/default.conf
EXPOSE 80
