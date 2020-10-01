package org.blankenship.movies.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

//@Document //Tells Hibernate/Spring this is an object to map to a Mongo table
//Lombak annotations used to produce getters/setters to reduce boilerplate code within the files
@Getter
@Setter
@Document("movieDetails")
@AllArgsConstructor
public class Movie {

    @Id
    private String id;

    public String title;

    public int year;

    public String rated;

    public int runtime;

//    public List<String> genres;

    public String director;

//    public List<String> writers;
//
//    public List<String> actors;

    public String plot;

    public String poster;

    public Movie(String title) {
        this.title = title;
    }

    @Override
    public String toString() {
        return "Movie { " + "title: " + title + "}";
    }
}
