## Base Alpine Linux based image with OpenJDK JRE only
FROM openjdk:11-jre-alpine
# copy application WAR (with libraries inside)
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} app.jar
# specify default command
#CMD ["/usr/bin/java", "-jar", "-Dspring.profiles.active=test", "/app.jar"]
CMD ["/usr/bin/java", "-jar", "-Dspring.profiles.active=prod", "/app.jar"]