import { verifySessionToken } from '@/lib/firebase/auth';
import { cookies } from 'next/headers';
import { adminDB } from '@/lib/firebase/admin';

export default async function WatchedPage() {
  const user = await verifySessionToken(cookies().toString());

  const snapshot = await adminDB.collection('/users/' + user?.uid + "/movies").get();
  const movies = snapshot.docs.map(doc => doc.data());

  return (
    <div>
      <h1>Watched Movies</h1>
      <ul>
        {movies.map((movie, index) => (
          <li key={index}>{movie.title}</li>
        ))}
      </ul>
    </div>
  );
}
// "use client";

// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Container,
//   Tab,
//   Tabs,
//   Typography,
//   useTheme,
//   useMediaQuery,
// } from "@mui/material";
// import { Movie } from "@/data-models/movie.interface";
// import { useRouter } from "next/navigation";
// import { getContent } from "@/utils/api/contentApi";
// import useGetMyFavoriteProviders from "@/hooks/useGetMyFavoriteProviders";
// import { LoadingScreen } from "@/components/loading";
// import { ProviderList } from "@/components/provider";
// import { buildListOfMoviesOnEachProvider } from "@/utils/helpers/buildListOfMoviesOnEachProvider";
// import { useCurrentUser } from "@/hooks/useCurrentUser";

// const WatchedPage = () => {
//   // const user = await verifySessionToken(cookies().toString());
//   const { user } = useCurrentUser();
//   const { isLoading, myFavoriteProviders } = useGetMyFavoriteProviders(user?.uid || "");
//   const [watchList, setWatchList] = useState<Movie[]>([]);
//   const [tab, setTab] = useState(0);
//   const router = useRouter();

//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
//   useEffect(() => {
//     if (user !== null && user !== undefined) {
//       getContent(user?.uid)
//         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//         .then((data: any) => setWatchList(data))
//         .catch((err) => {
//           console.error("Error making async call: " + err);
//           router.push("/");
//         });
//     }
//   }, [user]);

//   if (isLoading) return <LoadingScreen />;

//   const lists = buildListOfMoviesOnEachProvider(watchList, myFavoriteProviders);

//   return (
//     <Container maxWidth="lg" sx={{ py: 4 }}>
//       <Typography variant="h4" fontWeight={600} gutterBottom>
//         Where to Watch Your Movies
//       </Typography>

//       <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
//         <Tabs
//           value={tab}
//           onChange={(e, newValue) => setTab(newValue)}
//           variant={isMobile ? "scrollable" : "standard"}
//           scrollButtons={isMobile ? "auto" : false}
//         >
//           <Tab label="Stream" />
//           <Tab label="Rent" />
//           <Tab label="Purchase" />
//         </Tabs>
//       </Box>

//       {tab === 0 && <ProviderList providers={lists.streamer} listName="Stream" />}
//       {tab === 1 && <ProviderList providers={lists.rental} listName="Rent" />}
//       {tab === 2 && <ProviderList providers={lists.purchase} listName="Purchase" />}
//     </Container>
//   );
// };

// export default WatchedPage;