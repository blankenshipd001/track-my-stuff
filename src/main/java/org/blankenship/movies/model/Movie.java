package org.blankenship.movies.model;

import lombok.Generated;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.Column;
import javax.persistence.GenerationType;
import javax.persistence.Table;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity //Tells Hibernate/Spring this is an Entity to map to a database object
@Table(name = "movie") // Tells Hibernate/Spring what table to map the object to
//Lombak annotations used to produce getters/setters to reduce boilerplate code within the files
@Getter
@Setter
public class Movie {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title", nullable = false)
    public String title;

    public Movie() { }

    public Movie(String title) {
        this.title = title;
    }

    @Override
    public String toString() {
        return "Movie { " + "title: " + title + "}";
    }
}
