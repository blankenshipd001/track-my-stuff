package org.blankenship.movies.service;

import org.blankenship.movies.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.blankenship.movies.model.Movie;
import java.util.List;

@Service
public class MovieService {

    @Autowired
    private MovieRepository movieRepository;

    /**
     * Method returns a simple list of all {Movie} objects in the system
     * @return List<Movie>
     */
    public List<Movie> list() {
        return movieRepository.findAll();
    }

    /**
     * Saves a single Movie to the system
     * @param movie {Movie} object to save
     * @return the saved Movie with it's ID
     */
    public Movie save(Movie movie) {
        return movieRepository.save(movie);
    }

    /**
     * Count the number of {Movie} objects in the system
     * @return {long} count of movies in the system
     */
    public long count() {
        return movieRepository.count();
    }
}
