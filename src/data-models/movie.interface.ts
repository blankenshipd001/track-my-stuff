import { ServiceProvider } from "./service-provider.interface"

export interface Movie {
    adult: boolean,
    backdrop_path: string,
    // genre_ids: [],
    genres: [
        {id: number, name: string}
    ]
    id?: number,
    movieId: number,
    original_language: string,
    original_title: string,
    overview: string,
    popularity: number,
    poster_path: string,
    providers: {
        buy: [ServiceProvider],
        link: string,
        rent: [ServiceProvider],
        flatrate: [ServiceProvider],
    }
    release_date: string,
    title: string,
    video: boolean,
    vote_average: number,
    vote_count: number,
    media_type: string,
    first_air_date: string,
}