FROM node:20-alpine

# Install build tools for better-sqlite3
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Install backend dependencies (builds better-sqlite3 from source)
COPY package*.json ./
RUN npm ci --production

# Copy backend code
COPY . .

# Create db directory for SQLite
RUN mkdir -p /app/db

EXPOSE 3004

CMD ["node", "server.js"]
