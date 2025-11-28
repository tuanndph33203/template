# ==========================
# 🏗 Stage 1 - Build Angular
# ==========================
FROM node:20-alpine AS build

# Install dependencies for node-gyp & sharp if needed
RUN apk add --no-cache python3 make g++ 

WORKDIR /app

# Copy package files first to optimize layer caching
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy full source
COPY . .

# Build Angular production
RUN yarn build --configuration production


# ==========================
# 🌐 Stage 2 - Run with NGINX
# ==========================
FROM nginx:stable-alpine

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy built Angular dist
COPY --from=build /app/dist/* /usr/share/nginx/html/

# Copy nginx config (optional but recommended)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
