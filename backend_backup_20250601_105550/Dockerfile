FROM node:16-alpine

# Install dependencies
RUN apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev > /dev/null 2>&1

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy app source
COPY . .

# Build the app
RUN npm run build

# Expose port
EXPOSE 1337

# Set environment variables
ENV NODE_ENV=production

# Start the application
CMD ["npm", "run", "start"] 