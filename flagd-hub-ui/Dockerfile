# Build stage
FROM node:16 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Serve stage
FROM nginx:stable-alpine
WORKDIR /usr/share/nginx/html

# Copy React build files
COPY --from=build /app/build .

# Add a script to inject environment variables
COPY ./env.sh .
RUN chmod +x env.sh

# Replace placeholders at runtime
CMD ["sh", "-c", "./env.sh && nginx -g 'daemon off;'"]
