package org.blankenship.movies.repository

import org.blankenship.movies.model.Movie;
import org.junit.Before
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.data.mongo.AutoConfigureDataMongo;
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.context.junit4.SpringRunner
import spock.lang.Shared;
import spock.lang.Specification;

//@RunWith(SpringRunner.class)
//@SpringBootTest
//@AutoConfigureDataMongo
//@ExtendWith(SpringExtension.class)
//@ActiveProfiles("dev")
class MovieRepositoryUnitSpec extends Specification {

    @Shared
    @Autowired
    private MovieRepository movieRepository;

    void setupSpec() {
        //Load some data here
    }

    void 'test getting all movies'() {
        given: 'an existing count'
            long initialCount = movieRepository.count()

        when: 'adding 3 more'
            movieRepository.save(new Movie("Iron Man"))
            movieRepository.save(new Movie("Hulk"))
            movieRepository.save(new Movie("Spider-Man: Homecoming"))

        then: 'The count should increase by 3'
            initialCount == initialCount + 3

        and: 'the 3 newly added movies should be included'
            movieRepository.findAll().contains("Hulk")
            movieRepository.findAll().contains("Spider-Man: Homecoming")
            movieRepository.findAll().contains("Iron Man")
    }
}
