FROM node:22.15.0 AS builder
WORKDIR /favorites-service
COPY package*.json ./
COPY tsconfig*.json ./
COPY src ./src
RUN npm ci
RUN npm run build

FROM node:22.15.0
WORKDIR /favorites-service
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /favorites-service/dist ./dist
CMD [ "npm", "start" ]