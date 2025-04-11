export interface Content {
  aliases: string[];
  companies: string[];
  company: string;
  name: string;
  country: string;
  director: string;
  first_air_time: string;
  genres: string[];
  id: string;
  image_url: string;
  imdb_id: string;
  is_official: boolean;
  name_translated: string;
  network: string;
  objectID: string;
  officialList: string;
  overview: string;
  overview_translated: string[];
  poster: string;
  posters: string[];
  primary_language: string;
  remote_id: RemoteId[];
  status: string;
  slug: string;
  studios: string[];
  title: string;
  thumbnail: string;
  translationsWithLang: string[];
  tvdb_id: string;
  type: string;
  year: string;
}

export interface RemoteId {
  id: string;
  type: number;
  sourceName: string;
}

export interface Movie2face {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: { Source: string; Value: string }[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
}
