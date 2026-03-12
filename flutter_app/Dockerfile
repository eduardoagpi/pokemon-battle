# -------- Builder stage --------
FROM debian:bookworm-slim AS builder

# Install dependencies
RUN apt-get update && apt-get install -y \
    curl \
    git \
    unzip \
    xz-utils \
    zip \
    libglu1-mesa \
    && rm -rf /var/lib/apt/lists/*

# Install Flutter
RUN git clone https://github.com/flutter/flutter.git /usr/local/flutter
ENV PATH="/usr/local/flutter/bin:/usr/local/flutter/bin/cache/dart-sdk/bin:${PATH}"

# Run flutter doctor and enable web
RUN flutter doctor
RUN flutter config --enable-web

# Set working directory
WORKDIR /app

# Copy pubspec and get dependencies
COPY flutter_app/pubspec.yaml flutter_app/pubspec.lock ./
RUN flutter pub get

# Copy source code
COPY flutter_app/ .

# Build arguments for environment variables
ARG WEB_FLUTTER_INITIAL_API_URL
ARG WEB_BATTLE_SERVER

# Build Flutter web
RUN flutter build web \
    --dart-define=WEB_FLUTTER_INITIAL_API_URL=$WEB_FLUTTER_INITIAL_API_URL \
    --dart-define=WEB_BATTLE_SERVER=$WEB_BATTLE_SERVER

# -------- Production stage --------
FROM nginx:stable-alpine

# Copy Nginx configuration
COPY flutter_app/nginx.conf /etc/nginx/conf.d/default.conf

# Copy build artifacts from builder stage
COPY --from=builder /app/build/web /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
