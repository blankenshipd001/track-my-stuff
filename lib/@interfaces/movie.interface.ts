import { Provider } from "./provider.interface"

export interface Movie {
    adult: boolean,
    backdrop_path: string,
    genre_ids: [],
    id: number,
    movieId: number,
    original_language: string,
    original_title: string,
    overview: string,
    popularity: number,
    poster_path: string,
    providers: {
        buy: [Provider],
        link: string,
        rent: [Provider],
        flatrate: [Provider],
    }
    release_date: string,
    title: string,
    video: boolean,
    vote_average: number,
    vote_count: number,
}