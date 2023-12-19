FROM maven:3.8.2-openjdk-17 AS build
COPY . .
RUN mvn clean package -DskipTests

FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build app/target/backend-0.0.1-SNAPSHOT.jar backend.jar
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "backend.jar"]