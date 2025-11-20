FROM node:18-alpine
WORKDIR /usr/src/app

# Install dependencies (including dev deps for ts-node)
COPY package*.json ./
ENV NODE_ENV=development
RUN npm install --silent

# Copy source
COPY . .

EXPOSE 4001
CMD ["npm", "run", "start"]
