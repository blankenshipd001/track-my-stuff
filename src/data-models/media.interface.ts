import { ServiceProvider } from "./service-provider.interface";

export interface Media {
  //this field is NOT pulled from an API. type is added to indicate if it's a tv show or movie
  type?: string;
  //this field is NOT pulled from an API but added from the watchilst to indicate the watching status
  status?: "watching" | "completed" | "watchlist" | undefined; 
  provider: string;
  selectedStreamer?: string;
  selectedPoster?: string;
  rating: number;
  episodeCount?: number;
  currentEpisode?: number;
  progress: {
    current: number, 
    total: number,
  },
  airDate?: string;
  adult: boolean;
  backdrop_path: string;
  // genre_ids: [],
  genres: [{ id: number; name: string }];
  id?: number;
  imdb_id: string;
  name: string;
  movieId: number;
  original_language: string;
  original_title: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  next_episode_to_air: any;
  networks: [{
    id: number;
    name: string;
    logo_path: string;
    origin_country: string;
  }]
  providers: {
    buy?: [ServiceProvider];
    link?: string;
    rent?: [ServiceProvider];
    flatrate?: [ServiceProvider];
  };
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  media_type: string;
  first_air_date: string;
  videos: {
    results: [
      {
        iso_639_1: string;
        iso_3166_1: string;
        name: string;
        key: string;
        site: string;
        size: number;
        type: string;
        official: boolean;
        published_at: string;
        id: string;
      }
    ];
  };
  images: {
    logos: [
      {
        aspect_ratio: number;
        file_path: string;
        height: number;
        iso_639_1: string;
        vote_average: number;
        vote_count: number;
        width: number;
      }
    ];
    backdrops: [
      {
        aspect_ratio: number;
        file_path: string;
        height: number;
        iso_639_1: string;
        vote_average: number;
        vote_count: number;
        width: number;
      }
    ];
    posters: [
      {
        aspect_ratio: number;
        file_path: string;
        height: number;
        iso_639_1: string;
        vote_average: number;
        vote_count: number;
        width: number;
      }
    ];
  };
  episodes?: Array<{
    season_number: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    episodes: any[];
  }>;
}
