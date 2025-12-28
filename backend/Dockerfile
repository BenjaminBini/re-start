FROM node:20-slim

WORKDIR /app

# Install backend dependencies
COPY package*.json ./
RUN npm ci --production

# Copy backend code
COPY . .

# Create db directory for SQLite
RUN mkdir -p /app/db

EXPOSE 3004

CMD ["node", "server.js"]
