package org.blankenship.movies.model;

import lombok.Generated;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.persistence.Entity;
import javax.persistence.Column;
import javax.persistence.GenerationType;
import javax.persistence.Table;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;
import java.util.List;

//@Entity //Tells Hibernate/Spring this is an Entity to map to a database object
//Lombak annotations used to produce getters/setters to reduce boilerplate code within the files
@Getter
@Setter
@Document
public class Movie {

    @Id
    private String id;

    @NotNull
    @Column(name = "title", nullable = false)
    public String title;

    public Double year;

    public String rated;

    public Double runtime;

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
