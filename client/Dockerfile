# 1. Build Stage
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy project files and build static bundle for web
COPY . .
RUN npx expo export -p web

# 2. Production Stage (Nginx Alpine uses ~15MB RAM)
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy exported web bundle
COPY --from=build /app/dist .

# Copy custom Nginx configuration (SPA routing & /api reverse proxy)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

