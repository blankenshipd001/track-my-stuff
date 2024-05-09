import { doc, deleteDoc, writeBatch, DocumentData, collection, getDocs, setDoc, DocumentReference, WriteBatch } from "firebase/firestore";
import { db } from "@/config/firebase";
import { Movie } from "@/data-models/movie.interface";
import { ServiceProvider } from "@/data-models/service-provider.interface";

/**
 * Get all items from your watchlist
 *
 * @param uid unique id for the movie
 * @returns Array of {Movie} items
 */
export const getContent = async (uid: string): Promise<Movie[]> => {
  const path: string = "users/" + uid + "/movies";
  const moviesSnapshot: DocumentData = await getDocs(collection(db, path));

  const moviesList: Movie[] = moviesSnapshot.docs.map((doc: DocumentData) => {
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
export const requestRemoveFromWatchList = async (uid: string | undefined, movie: Movie): Promise<void> => {
  if (uid == null) {
    return new Promise(() => {
      // If we didn't send a user fail silently
      return;
    });
  }

  try {
    const path:string = "users/" + uid + "/movies";

    return await deleteDoc(doc(db, path, `${movie.id}`));
    
  } catch (error) {
    console.error("Error removing movie from watchlist: ", error);
  }
};

/**
 * Save my providers
 * @param uid the user's ID
 * @param providers {ServiceProvider} list of providers
 * @returns {Promise}
 */
export const saveMyProviders = async (uid: string | undefined, providers: ServiceProvider[]): Promise<void>  => {
  if (uid == null) {
    return new Promise((resolve) => {
      // If we didn't send a user fail silently
      return resolve;
    });
  }

  const path: string = "users/" + uid + "/providers";

  try {
    const querySnapshot: DocumentData = await getDocs(collection(db, path));
    const batchDelete: WriteBatch = writeBatch(db);

    querySnapshot.forEach((doc: DocumentData) => {
      batchDelete.delete(doc.ref);
    });

    await batchDelete.commit();

  } catch (error) {
    console.error("Error deleting existing favorites");
  }

  try {
    const batchWrite: WriteBatch = writeBatch(db);

    providers.map((provider: ServiceProvider) => {
      batchWrite.set(doc(db, path, `${provider.provider_id}`), { id: provider.provider_id, ...provider });
    });

    await batchWrite.commit();

  } catch (error) {
    console.error("Error saving providers: ", error);
  }
};

/**
 * Add a movie to my watchlist
 *
 * @param uid {string} user's ID so we can add it to their list
 * @param movie {Movie} the movie to add
 * @returns
 */
export const addToWatchList = async (uid: string, movie: Movie): Promise<Movie | string> => {
  if (uid == null) {
    return new Promise((resolve) => {
      // If we didn't send a user fail silently
      return resolve("No User ID");
    });
  }

  const path: string = `users/${uid}/movies`;
  const documentRef: DocumentReference = doc(db, path, `${movie.id}`);

  let docRef: Movie = movie;

  await setDoc(documentRef, {
    ...movie,
  }).then(() => {
    docRef = movie;
  });

  return docRef;
};

/**
 * Get my favorite providers
 *
 * @param uid unique userId to get providers for
 * @returns Array {ServiceProvider}
 */
export const getMyFavoriteProviders = async (uid: string): Promise<ServiceProvider[]> => {
  const path: string = "users/" + uid + "/providers";
  const providersSnapshot: DocumentData = await getDocs(collection(db, path));

  const providers: ServiceProvider[] = providersSnapshot.docs.map((doc: DocumentData) => {
    return {
      ...doc.data(),
    };
  });

  return providers;
};

/**
 * Check for a duplicate
 * @param uid {string} user's id
 * @param collectionName {string} collection to check for duplicates in
 * @param fieldName {string} what field we are using as a "key"
 * @param value {string} the value to compare against
 * @returns {boolean} true if there is a duplicate
 */
// const checkForDuplicates = async (uid: string, collectionName: string, fieldName: string, value: number | string) => {
//   const q = query(collection(db, `users/${uid}/${collectionName}`), where(fieldName, "==", value));
//   const querySnapshot = await getDocs(q);
//   return querySnapshot;
// };
