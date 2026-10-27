# Study Planner - Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files first (better layer caching)
COPY package.json ./

# Copy the rest of the application source
COPY server.js ./
COPY public ./public

# Port configuration (server.js reads process.env.PORT)
ENV PORT=3000
EXPOSE 3000

# Run as the non-root user that ships with the node image
USER node

CMD ["node", "server.js"]
