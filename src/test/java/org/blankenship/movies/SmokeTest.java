package org.blankenship.movies;

import org.blankenship.movies.controller.MovieController;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Ensures all the wiring happens
 */
@SpringBootTest
public class SmokeTest {

    @Autowired
    MovieController movieController;

    @Test
    public void contextLoads() throws Exception {
        assertThat(movieController).isNotNull();
    }
}
