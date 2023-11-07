"use client"
import Header from "@/lib/movies/header";
import Footer from "@/lib/shared/footer";
import { useEffect, useState } from "react";
import Link from "next/link";
import { signIn } from "@/lib/firestore";
import { getAuth, getRedirectResult, User as FirebaseUser } from "firebase/auth";

const Login = () => {
    const [user, setUser] = useState<FirebaseUser | null>(null)

    
    useEffect(()=> {
        const auth = getAuth();
        getRedirectResult(auth).then((result) => {
            setUser(result?.user)
            // to do redirect away from page if logged in 
        })
    }, [])
    useEffect(() => {
        console.log(user, 'user is set')
    }, [user])

 
  return (
    <>
      <Header />
        <div>
            <div className="items-center justify-center flex h-screen">
                <div className="w-full max-w-xs">
                    <form className="bg-white shadow-md rounded px-8 pt-6 pb-4 mb-2">
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                                Username
                            </label>
                            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username"
                                onChange={event => setUser({ ...user, username: event.target.value })} />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                Password
                            </label>
                            <input className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************"
                                onChange={event => setUser({ ...user, password: event.target.value })} />

                        </div>
                        <div className="flex items-center justify-between">
                            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={signIn}>
                                Sign In With Google
                            </button>

                        </div>

                    </form>
                    <div className="pb-2"><Link href='/signup' >
                            Don&apos;t have an account?
                    </Link>
                    </div>
                </div>
            </div>
        </div>
      <Footer />
    </>
  );
};

export default Login;
