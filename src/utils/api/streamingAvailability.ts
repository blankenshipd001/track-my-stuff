//API backing this file: https://www.tvmaze.com/api#full-schedule

//NOT SURE I WANT TO USE THIS LIBRARY
// import * as streamingAvailability from "streaming-availability";

// const client = new streamingAvailability.Client(new streamingAvailability.Configuration({
//     apiKey: process.env.RAPID_API_KEY
// }));

// export const getShowById = async (id: string) => {
//     const client = new streamingAvailability.Client(new streamingAvailability.Configuration({
//         apiKey: "4f8793f44cmsh374eb7411223a61p1b26b1jsn8add3d46f051"
//     }));

//     console.log('data');
//     const data = await client.showsApi.getShow({
//         id: "tt0068646"
//     });

//     console.log(data);

//     return data;
// }

export function fetchShowById(id: string) {
//     Example: https://api.tvmaze.com/lookup/shows?thetvdb=81189

// Example: https://api.tvmaze.com/lookup/shows?imdb=tt0944947

console.log('fetchShowById:', id);
    const response = fetch(`https://api.tvmaze.com/lookup/shows?imdb=${id}`).then(async (res) => {
        const json = await res.json()
        console.log('single:', json); 
        return json
    });

    return response;

    // const response = fetch(`https://api.tvmaze.com/shows/${1}`).then(async (res) => {
    //     return await res.json()
    // }) 
        // const response = fetch(`https://api.tvmaze.com/schedule`).then(async (res) => {
    //     const json = await res.json()
    //     console.log(json);
    //     return json
    // }) 
  }

  //what's on tv tonight: https://api.tvmaze.com/schedule?country=US&date=2014-12-01
  // what's streaming on web: https://api.tvmaze.com/schedule/web?date=2020-05-29&country=US
  // show by ID: https://api.tvmaze.com/shows/1