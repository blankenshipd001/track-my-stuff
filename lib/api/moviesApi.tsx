import { doc, deleteDoc, collection, getDocs } from "firebase/firestore";
import { db } from "./firestore";


    
export const getMovies = async (uid: string) => {
  const path = "users/" + uid + "/movies";
    console.log("using path:" + path);
    const moviesSnapshot = await getDocs(collection(db, path));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const moviesList = moviesSnapshot.docs.map((doc: any) => {
      return {
        id: doc.id,
        docId: doc.documentId,
        ...doc.data(),
      };
    });
    return moviesList;
  };

  export const requestRemoveFromWatchList = async (movie: any) => {
    return await deleteDoc(doc(db, "movies", `${movie.id}`))
  };
  