FROM ubuntu:latest
LABEL authors="Matthew"

FROM maven:3.8.2-jdk-17 AS build
COPY . .
RUN mvn clean package -DskipTests

FROM openjdk:17-jdk-slim
COPY --from=build /target/backend-0.0.1-SNAPSHOT.jar backend.jar
EXPOSE 8080

ENTRYPOINT ["java","-jar","app.jar"]