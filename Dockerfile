# Stage 1
FROM node:18.16.0 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2
FROM nginx:1.21.3-alpine
COPY --from=build /app/dist/autobahn-assessment /usr/share/nginx/html