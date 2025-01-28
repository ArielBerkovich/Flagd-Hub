# Build stage
FROM node:16 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN GENERATE_SOURCEMAP=false npm run build

# Serve stage
FROM nginx:stable-alpine
WORKDIR /usr/share/nginx/html

# Copy React build files
COPY --from=build /app/build .

# Copy custom NGINX configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the JSON file to a location NGINX can serve
COPY environment.json /usr/share/nginx/html/environment.json

CMD ["nginx", "-g", "daemon off;"]
