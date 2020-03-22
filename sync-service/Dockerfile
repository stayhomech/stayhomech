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
EXPOSE 8080
COPY start.sh /start.sh
RUN chmod +x /start.sh
# TODO use the wait-for-it.sh
CMD [ "./start.sh" ]
