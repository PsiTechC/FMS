# Use official Node.js 18 image
FROM node:18

# Create app directory
WORKDIR /app

# Copy only package.json first
COPY package*.json ./

# Install fresh node_modules inside the container
RUN npm install

# Now copy rest of the source code
COPY . .

# Expose ports
EXPOSE 5000
EXPOSE 5001

# Run your app
CMD ["node", "server.js"]


