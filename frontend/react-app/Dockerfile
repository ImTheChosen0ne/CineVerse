FROM node:20.9.0-alpine
WORKDIR /app
COPY frontend/react-app/package.json .
RUN npm install
COPY frontend/react-app/ .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]