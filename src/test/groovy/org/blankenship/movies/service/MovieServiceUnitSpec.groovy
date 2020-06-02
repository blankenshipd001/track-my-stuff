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

        and: 'A movie saved into the Mongo Database'
            Movie movie = new Movie("IT")
            movieService.save(movie)

        and: 'The initial count of records'
            long initialCount = movieService.count()

        when: 'initiating a findAll() on the service'
            List<Movie> movies = movieService.list()

        then: 'the size should increase by 1'
            assert initialCount == initialCount++

        and: 'our list should contain the movie "IT"'
            assert null != movies.find { it -> it.title == "IT"}
    }
}
