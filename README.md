![Java CI with Maven](https://github.com/blankenshipd001/movies/workflows/Java%20CI%20with%20Maven/badge.svg?branch=master)

# movies
Custom application to track movies that I've seen or would like to see. Using Spring/Spring-security/Hibernate for the API and planning to use React for the client. 
Just starting the application in my spare time to learn some new technology stacks and enhance skills on existing ones.

# Building the source
    * From the movies directory a `mvn clean install -Pdev -s ./settings.xml` can be run. This will compile all source code and run all unit tests.
    * To package the project for production run `mvn packaage -Pproduction` 

# Deploying the application
    * From the server directory you can run `mvn spring-boot:run` this will start up a spring boot application and load an initial list of movies into an H2 database
    * You can then navigate to `http://localhost:8080` to view the application 
   
# Swagger
    * when running the application in spring-boot you can navigate to `http://localhost:8080/swagger-ui.html`     
   
   
# Helpful links:
    * https://github.com/mongobee/mongobee
    
    $ docker run -it --rm --name my-maven-project -v "$PWD":/usr/src/app \
     -v "$HOME"/.m2:/root/.m2 -w /usr/src/app maven:3.2-jdk-7 mvn clean install
     
     
# Logging
to change the log level a POST must be made to : 
curl -i -X POST -H 'Content-Type: application/json' -d '{"configuredLevel": "TRACE"}' http://<server>/actuator/loggers/<package>

    *  examples: 
        * curl -i -X POST -H 'Content-Type: application/json' -d '{"configuredLevel": "TRACE"}' http://localhost:8700/actuator/loggers/org.blankenship
        * curl -i -X POST -H 'Content-Type: application/json' -d '{"configuredLevel": "DEBUG"}' http://localhost:8700/actuator/loggers/ROOT