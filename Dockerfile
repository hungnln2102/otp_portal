# Stage 1: Build Frontend
FROM node:20-alpine AS build
WORKDIR /app

ENV npm_config_fund=false \
    npm_config_audit=false \
    npm_config_progress=false

COPY package*.json ./
RUN npm ci --prefer-offline --no-audit

COPY . .
RUN npm run build

# Stage 2: Production Nginx Runtime
FROM nginx:1.27-alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html/system

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
