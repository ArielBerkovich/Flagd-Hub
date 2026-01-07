# Multi-stage build for Spring Boot application
FROM eclipse-temurin:17-jdk AS build

WORKDIR /app

# Copy Gradle wrapper and build files
COPY gradlew .
COPY gradle gradle/
COPY build.gradle .
COPY settings.gradle .

# Copy all subprojects
COPY swagger-schemas swagger-schemas/
COPY flagd-hub-api flagd-hub-api/

# Make gradlew executable
RUN chmod +x gradlew

# Build the application
RUN ./gradlew :flagd-hub-api:bootJar --no-daemon

# Runtime stage
FROM eclipse-temurin:17-jre

WORKDIR /app

# Copy the built JAR from build stage
COPY --from=build /app/flagd-hub-api/build/libs/*.jar app.jar

# Expose the application port
EXPOSE 8090

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
