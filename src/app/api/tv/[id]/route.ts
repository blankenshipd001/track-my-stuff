import { NextRequest, NextResponse } from "next/server";
import { fetchTVDetails } from "@/services";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(request: NextRequest, { params }: { params: any }) {
  const id = (params && (await params).id) || params?.id;
  if (!id) {
    const headers = new Headers();
    headers.set('Cache-Control', 'public, max-age=0');
    return NextResponse.json(
      { error: "Missing id" },
      { status: 400, headers }
    );
  }

  try {
    let tv;
    try {
      tv = await fetchTVDetails(id);
    } catch (error) {
      console.error('Error fetching TV details:', error);
      tv = null;
    }
    if (!tv) {
      const headers = new Headers();
      headers.set('Cache-Control', 'public, max-age=60');
      return NextResponse.json(
        { error: "Not found" },
        { status: 404, headers }
      );
    }

    // Cache headers
    const headers = new Headers();
    headers.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
    headers.set('CDN-Cache-Control', 'max-age=86400');

    return NextResponse.json(tv, { headers });
  } catch (err) {
    const headers = new Headers();
    headers.set('Cache-Control', 'public, max-age=60');
    return NextResponse.json(
      { error: String(err) },
      { status: 500, headers }
    );
  }
}
