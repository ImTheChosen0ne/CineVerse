# Stage 1: Build React frontend
FROM node:20.9.0-alpine AS frontend_builder

WORKDIR /app

COPY ./src/main/frontend/react-app/package.json .

RUN npm install

COPY ./src/main/frontend/react-app .

RUN npm run build

FROM maven:3.8.2-openjdk-17 AS build
COPY . .
RUN mvn clean package -DskipTests

FROM openjdk:17-jdk-slim
WORKDIR /Java-web-app/src/main
COPY --from=frontend_builder /app/build /Java-web-app/src/main/frontend/react-app/build
COPY --from=build /target/backend-0.0.1-SNAPSHOT.jar backend.jar
EXPOSE 3000 8080

ENTRYPOINT ["java","-jar","backend.jar"]
CMD ["npm", "start"]
