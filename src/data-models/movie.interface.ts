import { ServiceProvider } from "./service-provider.interface"

export interface Movie {
    adult: boolean,
    backdrop_path: string,
    // genre_ids: [],
    genres: [
        {id: number, name: string}
    ],
    id?: number,
    imdb_id: string,
    name: string,
    movieId: number,
    original_language: string,
    original_title: string,
    original_name: string,
    overview: string,
    popularity: number,
    poster_path: string,
    providers: {
        buy: [ServiceProvider],
        link: string,
        rent: [ServiceProvider],
        flatrate: [ServiceProvider],
    },
    release_date: string,
    title: string,
    video: boolean,
    vote_average: number,
    vote_count: number,
    media_type: string,
    first_air_date: string,
}