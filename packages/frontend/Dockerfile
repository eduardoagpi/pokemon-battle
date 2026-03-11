# -------- Builder stage --------
FROM node:20-alpine AS builder

WORKDIR /app

# Borrar cache de npm si es necesario o usar mirrors si falla
# RUN npm config set registry https://registry.npmjs.org/

# Copiar manifests de la raíz y de los paquetes necesarios (monorepo)
COPY package*.json ./
COPY packages/shared/package*.json packages/shared/
COPY packages/frontend/package*.json packages/frontend/

# Instalar dependencias del monorepo
RUN npm install

# Copiar el código fuente de los paquetes necesarios
COPY packages/shared packages/shared
COPY packages/frontend packages/frontend

# Build shared first (dependency of frontend)
RUN npm run build -w @poke-albo/shared

# Build arguments for Vite (environment variables)
ARG VITE_INITIAL_API_URL
ARG VITE_BATTLE_SERVER
ARG VITE_PORT

# Inject build arguments into environment variables for Vite build
ENV VITE_INITIAL_API_URL=$VITE_INITIAL_API_URL
ENV VITE_BATTLE_SERVER=$VITE_BATTLE_SERVER
ENV VITE_PORT=$VITE_PORT

# Build frontend
RUN npm run build -w frontend

# -------- Production stage --------
FROM nginx:stable-alpine

# Copiar la configuración de Nginx para SPA
COPY packages/frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos estáticos generados por Vite
COPY --from=builder /app/packages/frontend/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
