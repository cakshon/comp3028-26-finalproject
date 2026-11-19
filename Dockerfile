
# Use Node.js to run the LocalLoop backend
FROM node:24-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the npm configuration files
COPY package*.json ./

# Install the backend dependencies
RUN npm ci --omit=dev

# Copy the application files
COPY . .

# Run the application as a non-root user
USER node

# Express runs on port 3000
EXPOSE 3000

# Start the backend server
CMD ["npm", "start"]
