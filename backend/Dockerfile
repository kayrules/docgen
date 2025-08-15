# Backend Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install git, ssh, and curl (needed for project cloning and health checks)
RUN apk add --no-cache git bash curl openssh-client

# Copy package files
COPY package.json ./

# Install dependencies
RUN npm install --only=production

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p repositories docupilot templates backups

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Start the application
CMD ["npm", "start"]