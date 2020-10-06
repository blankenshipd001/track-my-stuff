import axios from 'axios';

/**
 * Service used to standardize ways to talk to the server
 * @type {{search: (function(string): Promise<*>), save: (function(Object): Promise<*>)}}
 */
export const movieService = {
    save,
    search
};

/**
 * Save a movie to mongo. Movie is translated to using lowercase properties since our service requires this.
 * @param movie {object} movie object returned from the open movie DB
 * @return {Promise<any>}
 */
function save(movie) {
    return axios.post('/movie/', {
        actors: movie.Actors,
        awards: movie.awards,
        boxOffice: movie.BoxOffice,
        country: movie.Country,
        dvd: movie.DVD,
        director: movie.Director,
        genre: movie.Genre,
        language: movie.Language,
        metascore: Number(movie.Metascore),
        plot: movie.Plot,
        poster: movie.Poster,
        production: movie.Production,
        rating: movie.Rated,
        ratings: movie.Ratings,
        released: movie.Released,
        runtime: movie.Runtime,
        title: movie.Title,
        type: movie.Type,
        website: movie.Website,
        writer: movie.Writer,
        year: Number(movie.Year),
        imdbId: movie.imdbID,
        imdbRating: movie.imdbRating,
        imdbVotes: movie.imdbVotes
    });
}

/**
 * Search for a movie by title
 * @param title {string} movie title. Fuzzy search does seem to work. TODO: look at more options
 * @return {Promise<any>}
 */
function search(title) {
    return axios.get(`http://www.omdbapi.com/?apikey=eec923bb&t=${title}`);
}
