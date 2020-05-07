package org.blankenship.movies;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories
public class MoviesApplication {

    public static void main(String... args) {
        SpringApplication.run(MoviesApplication.class, args);
    }
}
