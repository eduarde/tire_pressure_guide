# Frontend Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Build argument for API URL
ARG VITE_API_URL=http://localhost:8088
ENV VITE_API_URL=$VITE_API_URL

# Build argument for Google Tag Manager ID
ARG VITE_GTM_ID
ENV VITE_GTM_ID=$VITE_GTM_ID

# Install dependencies first for better caching
COPY package.json package-lock.json ./

# Clean npm cache and install dependencies
RUN npm cache clean --force && \
    npm install --verbose

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files to nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration from builder
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
