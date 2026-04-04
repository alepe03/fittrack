# Build (contexto: raíz del repositorio FitTrack)
FROM node:22-alpine AS builder

WORKDIR /app

COPY front/package.json front/package-lock.json ./
RUN npm ci

COPY front/ ./
RUN npm run build

# Servir estáticos + proxy /api hacia el nginx del backend
FROM nginx:1.27-alpine

COPY deploy/docker/front/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
