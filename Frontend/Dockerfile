# Linux alpine image containing node.js 24:
FROM node:24-alpine

# Create the project folder inside the container and work from it:
WORKDIR /app

# Copy ONLY package.json (not the lock file) - npm then resolves every dependency
# fresh for Linux, including vite's native bindings, instead of the Windows ones the lock was made with:
COPY ./package.json /app

# Install dependencies inside the image (Linux binaries, not the Windows ones from the host):
RUN npm install

# Copy the rest of the app to /app inside the image (node_modules and .env are skipped by .dockerignore):
COPY . /app/

# What runs when the container starts -> "npm start" -> vite dev server on port 5173:
ENTRYPOINT [ "npm", "start" ]
