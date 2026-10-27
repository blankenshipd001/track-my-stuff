import { verifySessionToken } from "@/lib/firebase/auth";
import getCookieHeader from "@/lib/getCookieHeader";
import WatchListPage from "@/app/watched/WatchListPage";
import { adminDB } from "@/lib/firebase/admin";
import { Media } from "@/data-models/media.interface";
import { User } from "@/data-models/user.interface";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "My Queue | ReelTime",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function WatchlistPage() {
  return (
    <Suspense fallback={<div style={{ color: "white", padding: "20px" }}>Loading watchlist...</div>}>
      <WatchlistContent />
    </Suspense>
  );
}

async function WatchlistContent() {
  const cookieHeader = await getCookieHeader();
  const user: User | null = await verifySessionToken(cookieHeader);

  if (!user?.uid) {
    return <WatchListPage movies={[]} tvShows={[]} user={user} />;
  }

  const snapshot = await adminDB.collection("/users/" + user.uid + "/movies").get();
  const allMedia: Media[] = snapshot.docs.map((doc) => doc.data() as Media);

  const queued = allMedia.filter((item) => item.status === "watchlist");
  const movies = queued.filter((item) => !!item.title);
  const tvShows = queued.filter((item) => !!item.name);

  return <WatchListPage movies={movies} tvShows={tvShows} user={user} />;
}
