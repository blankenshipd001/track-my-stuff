"use client"
import Header from "@/lib/movies/header";
import Footer from "@/lib/shared/footer";
import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";

const Login = () => {
    const [user, setUser] = useState({username: '', password: ''});
    

    const signIn = () => {
        const auth = getAuth();

        signInWithEmailAndPassword(auth, user.username, user.password)
            /* eslint-disable @typescript-eslint/no-unused-vars */
            .then((userCredential) => {
                // TODO: Once Signed In where do we want to navigate to?
                
            })
            .catch((error) => {
                const errorMessage = error.message;

                alert(errorMessage.split(':')[1])
            });
    }
 
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
                                Sign In
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
