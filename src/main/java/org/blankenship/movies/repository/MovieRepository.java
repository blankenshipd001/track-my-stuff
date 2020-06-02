package org.blankenship.movies.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.transaction.annotation.Transactional;
import org.blankenship.movies.model.Movie;

@Transactional
public interface MovieRepository extends MongoRepository<Movie, String> {

    Movie findByTitle(String title);
}
