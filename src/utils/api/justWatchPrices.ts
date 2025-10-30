// import * as justWatchApi from "justwatch-api"
// // const JustWatch = require('justwatch-api');

// async function getMoviePricesFromJustWatch(title, country = 'US') {
//   const justWatch = new justWatchApi({ locale: country.toLowerCase() });
//   const results = await justWatch.search({ query: title });

//   const movie = results.items[0]; // top result
//   const offers = movie.offers || [];

//   // Group offers by type
// interface Offer {
//     monetization_type: string;
//     provider_id: number;
//     retail_price?: number;
//     presentation_type?: string;
//     urls?: {
//         standard_web?: string;
//         [key: string]: string | undefined;
//     };
// }

// interface GroupedOffers {
//     [monetizationType: string]: Array<{
//         provider: number;
//         price?: number;
//         quality?: string;
//         url?: string;
//     }>;
// }

// const grouped: GroupedOffers = offers.reduce((acc: GroupedOffers, offer: Offer) => {
//     const type = offer.monetization_type;
//     acc[type] = acc[type] || [];
//     acc[type].push({
//         provider: offer.provider_id,
//         price: offer.retail_price,
//         quality: offer.presentation_type,
//         url: offer.urls?.standard_web,
//     });
//     return acc;
// }, {});

//   return grouped;
// }