# ---------- Builder ----------
FROM node:20-bookworm-slim AS builder

WORKDIR /app

# OpenSSL is required so Prisma generates the correct engine
RUN apt-get update && \
    apt-get install -y --no-install-recommends openssl && \
    rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx prisma generate

# Remove development dependencies before copying to runtime
RUN npm prune --omit=dev


# ---------- Runtime ----------
FROM node:20-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production

# Apply available OS security updates and provide OpenSSL for Prisma
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y --no-install-recommends openssl && \
    rm -rf /var/lib/apt/lists/*

# Copy the prepared application with production dependencies only
COPY --from=builder /app ./

# npm/npx are not required to run this service
RUN rm -rf /usr/local/lib/node_modules/npm && \
    rm -f /usr/local/bin/npm /usr/local/bin/npx

EXPOSE 5000

CMD ["node", "server.js"]