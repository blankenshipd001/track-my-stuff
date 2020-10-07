package org.blankenship.movies.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MovieDTO {

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
}
