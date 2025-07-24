"use client";

import { useState } from "react";
// import { fetchShowById } from "@/utils/api/streamingAvailability";
// import { getContent } from "@/utils/api/contentApi";

// import { useEffect, useState } from "react";
import { Item } from "./item";
// import { Media } from "@/data-models/movie.interface";
// import { useRouter } from "next/navigation";
import { Content } from "@/data-models/content.interface";
// import { useCurrentUser } from "@/hooks/useCurrentUser";

interface ItemData {
  image?: {
    medium?: string;
  };
  name: string;
  network?: {
    name?: string;
  };
  status?: string;
  schedule?: {
    days?: string[];
    time?: string;
  };
}

const Streaming = () => {
  // const router = useRouter();
  // const { user } = useCurrentUser();

  // const [watchlist, setWatchList] = useState<Media[]>([]);
  const [data, ] = useState<ItemData[]>();

  // useEffect(() => {
  //   if (user !== null) {
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //     getContent(user?.uid)
  //       // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //       .then((data: any) => {
  //         console.log(watchlist);
  //         setWatchList(data);
  //       })
  //       .catch((err) => {
  //         console.error("Error making async call: " + err);
  //         router.push("/");
  //       });
  //   } else {
  //     // No user is signed in.
  //     console.error("no one home");
  //     router.push("/");
  //   }
  // }, [user]);

  // useEffect(() => {
  //   console.log("watchlist loading");
  //   watchlist.map((item) => {
  //     const fetchData = async () => {
  //       console.log("item: ", item);
  //       console.log("item id: ", item.imdb_id);
  //       if (item.id !== undefined) {
  //         const dataResult = await getTheData(item.imdb_id);
  //         setData((prevData) => (prevData ? [...prevData, dataResult] : [dataResult]));
  //       }
  //     };
  //     fetchData();
  //   });
  // }, [watchlist]);

  // const getTheData = async (id: string) => {
  //   const result: ItemData = await fetchShowById(id);
  //   console.log("result: ", result);
  //   return result;
  // };

  return (
    <div>
      <div>What is Streaming</div>

      {!!(data && data.length > 0) &&
        data.map((item, index) => {
          return <Item data={item as Content} key={index} />;
        })}
    </div>
  );
};

export default Streaming;
