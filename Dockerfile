# #====================NPM=================
# # Use full Node.js 20 image
# FROM node:20

# WORKDIR /app

# # Copy package and lock files
# COPY package*.json ./

# # Install dependencies
# RUN npm install --force

# # Copy source code
# COPY . .

# EXPOSE 3000

# # Use Webpack instead of Turbopack for compatibility
# CMD ["npm", "run", "dev"]

#===================BUN=================

FROM oven/bun:1.1.0

WORKDIR /src

COPY bun.lockb package.json ./

RUN bun install

COPY . .

EXPOSE 3000

CMD [ "bun", "run", "dev"]