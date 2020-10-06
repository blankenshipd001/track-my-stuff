package org.blankenship.movies.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

//@Document //Tells Hibernate/Spring this is an object to map to a Mongo table
//Lombak annotations used to produce getters/setters to reduce boilerplate code within the files
@Getter
@Setter
@Document("movieDetails")
@AllArgsConstructor
@NoArgsConstructor
public class Movie {

    @Id
    private String _id;

    public String title;
    public int year;
    public String rating;
    public String runtime;
    public String director;
    public String plot;
    public String poster;
    public String actors;
    public String awards;
    public String boxOffice;
    public String country;
    public String dvd;
    public String language;
    public String metascore;
    public String production;
    public List<Rating> ratings;
    public String released;
    public String type;
    public String website;
    public String writer;
    public String imdbId;
    public String imdbRating;
    public String imdbVotes;

    public Movie(String title) {
        this.title = title;
    }

    public Movie(String id, String title, int year, String rated, String runtime, String director, String plot, String poster) {
        this.set_id(id);
        this.setTitle(title);
        this.setYear(year);
        this.setRating(rated);
        this.setRuntime(runtime);
        this.setDirector(director);
        this.setPlot(plot);
        this.setPoster(poster);
    }

    @Override
    public String toString() {
        return "Movie { " + "title: " + title + "}";
    }
}
