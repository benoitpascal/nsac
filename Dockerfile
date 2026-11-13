# Stage 1: Build
FROM hub.c2.agence418.fr/agence418/builder-os:24 AS builder
WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile --ignore-scripts

COPY . .
RUN pnpm run build

# Stage 2: Static server
FROM nginx:1.29-alpine AS runner

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
