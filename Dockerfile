FROM node:20-alpine

WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy rest of project
COPY . .

EXPOSE 3001

CMD ["node", "server.js"]