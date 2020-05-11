package org.blankenship.movies.service

import org.blankenship.movies.model.Movie
import org.junit.Test
import org.junit.runner.RunWith
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.context.junit4.SpringRunner
import spock.lang.Specification

@RunWith(SpringRunner)
@SpringBootTest
class MovieServiceUnitSpec extends Specification {

    @Autowired
    private MovieService movieService

    @Test
    void 'Test that when the application starts the default data is loaded'() {
        given: 'that the application has started and the service is wired'
            assert movieService != null

        when: 'initiating a findAll() on the service'
            List<Movie> movies = movieService.list()
        println "movies = $movies"

        then: 'our list should contain all the default entries'
            movies.size() == 23
    }

}
