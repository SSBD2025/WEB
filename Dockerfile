# Use Node.js for building
FROM node:20 AS builder

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy all project files
COPY . .

# Build the project
RUN npm run build

# Final stage (empty container, just for storing build files)
FROM alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist /app/dist
VOLUME /app/dist
CMD ["echo", "Frontend build ready"]
