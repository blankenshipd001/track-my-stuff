export interface Credit {
    adult: boolean;
    backdrop_path: string | null;
    genre_ids: number[];
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string | null;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
    character?: string; // Only for cast credits
    credit_id: string;
    order?: number; // Only for cast credits
    media_type: 'movie' | 'tv';
    name?: string; // For TV shows, the name field is used instead of title
    first_air_date?: string; // For TV shows, the first_air_date field is used instead of release_date
}