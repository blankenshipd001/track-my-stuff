"use client";
import React from "react";
import Footer from "@/lib/shared/footer";
// import { useEffect, useState } from "react";
import Link from "next/link";
import { signIn } from "@/lib/api/firestore";
// import { User as FirebaseUser } from "firebase/auth";
// import { useRouter } from 'next/navigation'
import Header from "@/lib/shared/header";

const Login = () => {
  // const [user, ] = useState<FirebaseUser | null>(null)
  // const router = useRouter()

  // useEffect(() => {
  //     auth.onAuthStateChanged(function(user) {
  //       if (user) {
  //         // User is signed in.
  //         router.push("/")
  //       } else {
  //         // No user is signed in.
  //         console.log('no one home')
  //       }
  //     });
  //   }, [router])

  return (
    <>
      <Header />
      <div>
        <div className="items-center justify-center flex h-screen">
          <div className="w-full max-w-xs">
            <form className="bg-white shadow-md rounded px-8 pt-6 pb-4 mb-2">
              <div className="flex items-center justify-between">
                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={signIn}>
                  Sign In With Google
                </button>
              </div>
            </form>
            <div className="pb-2">
              <Link href="/signup">Don&apos;t have an account?</Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
