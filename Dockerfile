FROM node:18-alpine
WORKDIR /app
ADD package.json package.json
RUN npm install --legacy-peer-deps
ADD . .
RUN npm run build
RUN curl -sf https://gobinaries.com/tj/node-prune | sh
RUN node-prune /usr/src/app/node_modules
CMD ["node", "./dist/main.js"]