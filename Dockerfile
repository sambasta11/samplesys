# ---------- Stage 1: build ----------
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .
# The project defaults to a Cloudflare build target; force a Node server build for Docker
ENV NITRO_PRESET=node-server
RUN npm run build

# ---------- Stage 2: run ----------
FROM node:22-alpine
WORKDIR /app

COPY --from=build /app/.output ./.output

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=8080
EXPOSE 8080

USER node
CMD ["node", ".output/server/index.mjs"]