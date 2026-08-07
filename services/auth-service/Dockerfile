# ---------- Builder ----------
FROM node:20-bullseye-slim AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx prisma generate

# ---------- Runtime ----------
FROM node:20-bullseye-slim

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=builder /app .

EXPOSE 5000

CMD ["npm","start"]