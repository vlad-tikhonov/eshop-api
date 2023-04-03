FROM node:18-alpine
WORKDIR /opt/app
ADD package.json package.json
RUN npm install
ADD . .
RUN npm run build --legacy-peer-deps
RUN npm prune --production
CMD ["node", "./dist/main.js"]