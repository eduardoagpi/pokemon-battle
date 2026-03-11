# -------- Builder stage --------
FROM node:20-alpine AS builder

WORKDIR /app

# copiar manifests primero (mejor cache)
COPY package*.json ./
COPY packages/shared/package*.json packages/shared/
COPY packages/battle-service/package*.json packages/battle-service/

# instalar dependencias
RUN npm install

# copiar el resto del código
COPY packages/shared packages/shared
COPY packages/battle-service packages/battle-service

# build shared
RUN npm run build -w @poke-albo/shared

# build battle-service
RUN npm run build -w battle-service


# -------- Production stage --------
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

# copiar manifests
COPY package*.json ./
COPY --from=builder /app/packages/shared/package*.json packages/shared/
COPY --from=builder /app/packages/battle-service/package*.json packages/battle-service/

# instalar deps prod
RUN npm install --omit=dev

# copiar builds
COPY --from=builder /app/packages/shared/dist packages/shared/dist
COPY --from=builder /app/packages/battle-service/dist packages/battle-service/dist

CMD ["npm", "run", "start", "-w", "battle-service"]
