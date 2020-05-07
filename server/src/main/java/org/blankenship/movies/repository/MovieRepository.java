package org.blankenship.movies.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.transaction.annotation.Transactional;
import org.blankenship.movies.model.Movie;

@Transactional
public interface MovieRepository extends JpaRepository<Movie, Long> {

}
