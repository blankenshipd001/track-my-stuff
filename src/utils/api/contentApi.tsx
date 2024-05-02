import { doc, deleteDoc, collection, getDocs } from "firebase/firestore";
import { Movie } from "@/data-models/movie.interface";
import { db } from "@/config/firebase";

/**
 * Get all items from your watchlist
 * 
 * @param uid unique id for the movie
 * @returns Array of {Movie} items
 */
export const getContent = async (uid: string) => {
  const path = "users/" + uid + "/movies";
    const moviesSnapshot = await getDocs(collection(db, path));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const moviesList: Movie[] = moviesSnapshot.docs.map((doc: any) => {
      return {
        id: doc.id,
        docId: doc.documentId,
        ...doc.data(),
      };
    });

    return moviesList;
  };

  /**
   * Remove a movie from the watchlist
   * @param uid the unique id for the movie
   * @param movie The {Movie} object
   * @returns Promise
   */
  export const requestRemoveFromWatchList = async (uid: string|undefined, movie: Movie) => {
    const path = "users/" + uid + "/movies";
    console.log("using path:" + path);
    return await deleteDoc(doc(db, path, `${movie.id}`))
  };
  
  