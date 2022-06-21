FROM openjdk:11-jdk-slim
ARG JAR_FILE=target/zuki-admin.jar
COPY ${JAR_FILE} zuki-admin.jar
ENTRYPOINT ["java","-jar","/zuki-admin.jar"]