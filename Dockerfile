# Stage 1: Build the application
FROM node:24-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install development and production dependencies
# This is necessary because the 'build' script might need dev dependencies (like TypeScript, rimraf)
RUN npm install

# Copy all source code
COPY . .

# Run the build script
# This will compile your TypeScript code into JavaScript in the 'dist' directory
RUN npm run build

# Stage 2: Create the final production image
FROM node:24-alpine AS production

WORKDIR /app

# Copy package.json and package-lock.json from the build stage
COPY --from=build /app/package*.json ./

# Install only production dependencies for the final image
RUN npm install --only=production

# Copy the built application from the build stage
COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/index.js"]