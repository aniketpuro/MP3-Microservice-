# Stage 1: Installing Dependencies

FROM node:22-alpine3.20 AS deps

WORKDIR /app

COPY package*.json .

RUN npm install

# Stage 2: Build App

FROM node:22-alpine3.20 AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

RUN rm -rf node_modules

RUN npm install --omit=dev

# Stage 3: Run

FROM node:22-alpine3.20

WORKDIR /app

# Set correct permissions for the node user
RUN chown -R node:node /app

COPY --from=builder --chown=node:node /app/.next ./.next
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/package.json ./

# Switch to the non-root user
USER node

CMD [ "npm", "run", "start" ]

EXPOSE 3000