# Frontend Dockerfile (Docusaurus)
FROM node:18-alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies with faster options
RUN npm install --no-audit --no-fund

# Copy application code
COPY . .

# Set Node.js memory limit and build with optimizations
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npm run build

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000 || exit 1

# Start the application
CMD ["npm", "run", "serve", "--", "--host", "0.0.0.0", "--port", "3000"]