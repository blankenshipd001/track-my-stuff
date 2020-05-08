# movies
Custom application to track movies that I've seen or would like to see. Using Spring/Spring-security/Hibernate for the API and planning to use React for the client. 
Just starting the application in my spare time to learn some new technology stacks and enhance skills on existing ones.

# Building the source
    * From the movies directory a `mvn clean install` can be run. This will compile all source code and run all unit tests. 

# Deploying the application
    * From the server directory you can run `mvn spring-boot:run` this will start up a spring boot application and load an initial list of movies into an H2 database
    
# Viewing the data
    * currently you can navigate to http://localhost:8080/h2-console 
    * use mem:movies for the database and sa/password for the credentials
    * You can then run `select * from movie` as the query and see the initial set of data

# Swagger
    * when running the application in spring-boot you can navigate to `http://localhost:8080/swagger-ui.html`     