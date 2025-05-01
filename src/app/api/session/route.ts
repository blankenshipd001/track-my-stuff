// import { cookies } from "next/headers";
// import { NextResponse } from "next/server";

// export async function POST(request: Request) {
//   const { token } = await request.json();
//   cookies().set("__session", token, {
//     httpOnly: true,
//     secure: true,
//     maxAge: 60 * 60 * 24 * 5, // 5 days
//     path: "/",
//   });

//   return NextResponse.json({ success: true });
// }

// export async function DELETE() {
//   cookies().delete("__session");
//   return NextResponse.json({ success: true });
// }