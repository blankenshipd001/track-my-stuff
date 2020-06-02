package org.blankenship.movies

import org.junit.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ActiveProfiles

@SpringBootTest
@ActiveProfiles("dev")
class MoviesApplicationTest {

    @Test
    void contextLoads() {
        //this test will fail if the automatic wiring fails
    }
}
