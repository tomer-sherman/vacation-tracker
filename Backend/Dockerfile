# Linux alpine image containing node.js 24:
FROM node:24-alpine

# Create the project folder inside the container and work from it:
WORKDIR /app

# Copy ONLY the package files first.
# Docker caches each step: as long as these two files don't change,
# the npm install below is reused from cache instead of running again:
COPY package.json package-lock.json ./

# Install dependencies INSIDE the image.
# This builds Linux binaries and Linux launcher scripts in node_modules/.bin,
# instead of the Windows ones from the host:
RUN npm install

# Now copy the rest of the source (node_modules is skipped by .dockerignore).
# This includes src/assets/images - the seed images that pre-fill assets-volume on the first run:
COPY . .

# Documentation only - the actual publishing to the host is done in compose.yml:
EXPOSE 4000

# What runs when the container starts -> "npm start" -> nodemon --exec tsx src/app.ts:
ENTRYPOINT [ "npm", "start" ]
