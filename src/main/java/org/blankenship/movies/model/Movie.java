package org.blankenship.movies.model;

import com.fasterxml.jackson.annotation.JsonView;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.blankenship.movies.controller.views.View;
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
    @JsonView(View.Summary.class)
    private String _id;

    @JsonView(View.Summary.class)
    public String title;

    @JsonView(View.Details.class)
    public int year;

    @JsonView(View.Details.class)
    public String rating;

    @JsonView(View.Details.class)
    public String runtime;

    @JsonView(View.Details.class)
    public String director;

    @JsonView(View.Summary.class)
    public String plot;

    @JsonView(View.Summary.class)
    public String poster;

    @JsonView(View.Details.class)
    public String actors;

    @JsonView(View.Details.class)
    public String awards;

    @JsonView(View.Details.class)
    public String boxOffice;

    @JsonView(View.Details.class)
    public String country;

    @JsonView(View.Details.class)
    public String dvd;

    @JsonView(View.Details.class)
    public String language;

    @JsonView(View.Details.class)
    public String metascore;

    @JsonView(View.Details.class)
    public String production;

    @JsonView(View.Details.class)
    public List<Rating> ratings;

    @JsonView(View.Details.class)
    public String released;

    @JsonView(View.Details.class)
    public String type;

    @JsonView(View.Details.class)
    public String website;

    @JsonView(View.Details.class)
    public String writer;

    @JsonView(View.Details.class)
    public String imdbId;

    @JsonView(View.Details.class)
    public String imdbRating;

    @JsonView(View.Details.class)
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
