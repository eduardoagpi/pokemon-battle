# -------- Builder stage --------
FROM node:20-alpine AS builder

WORKDIR /app

# copiar manifests primero (mejor cache)
COPY package*.json ./
COPY packages/shared/package*.json packages/shared/
COPY packages/backend/package*.json packages/backend/

# instalar dependencias
RUN npm install

# copiar el resto del código
COPY packages/shared packages/shared
COPY packages/backend packages/backend

# build shared
RUN npm run build -w @poke-albo/shared

# build backend
RUN npm run build -w backend


# -------- Production stage --------
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

# copiar manifests
COPY package*.json ./
COPY --from=builder /app/packages/shared/package*.json packages/shared/
COPY --from=builder /app/packages/backend/package*.json packages/backend/

# instalar deps prod
RUN npm install --omit=dev

# copiar builds
COPY --from=builder /app/packages/shared/dist packages/shared/dist
COPY --from=builder /app/packages/backend/dist packages/backend/dist
COPY --from=builder /app/packages/backend/src/assets packages/backend/dist/assets

CMD ["npm", "run", "start", "-w", "backend"]