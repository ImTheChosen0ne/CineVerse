# Stage 1: Build React frontend
FROM node:alpine AS frontend_builder

WORKDIR /src/main/frontend/react-app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

FROM maven:3.8.2-openjdk-17 AS build
COPY . .
RUN mvn clean package -DskipTests

FROM openjdk:17-jdk-slim
WORKDIR /Java-web-app/src/main
COPY --from=frontend_builder /src/main/frontend/react-app/build /src/main/frontend/react-app/build
COPY --from=build /target/backend-0.0.1-SNAPSHOT.jar backend.jar
EXPOSE 3000 8080

ENTRYPOINT ["java","-jar","backend.jar"]

