# Step : package jar
FROM maven:3.6.3-jdk-11-slim AS build
RUN mkdir -p /workspace
WORKDIR /workspace
COPY pom.xml /workspace
RUN mvn dependency:go-offline

COPY src /workspace/src
RUN mvn package -DskipTests

# Step : Package image
FROM openjdk:11-jdk-slim
COPY --from=build /workspace/target/*.jar app.jar
COPY start.sh /start.sh
COPY wait-for-it.sh /wait-for-it.sh
CMD [ "./wait-for-it.sh" , "-h", "sync-service", "-p", "8000" , "--strict" , "--timeout=600" , "--", "/start.sh" ]
