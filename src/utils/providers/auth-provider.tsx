import React, { FC, ReactNode, useContext, useEffect, useState } from "react";
import { User, signInWithPopup, signOut, onAuthStateChanged, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/config/firebase";


interface Props {
  children: ReactNode;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AuthContext = React.createContext<any>(null);

// export const useAuthContext = () => React.useContext(AuthContext);

export const AuthProvider: FC<Props> = ({ children }: Props) => {
  //TODO how can we type this?
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<User | null>();

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
    // TODO: Do we want to redirect to a page or just use the popup?
    // return signInWithRedirect(auth, googleProvider)
    //   .then(() => {})
    //   .catch(() => {});
  };

  const logOut = () => {
    signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser: User | null) => {
      //   if (user) {
      setUser(currentUser);
      //   } else {
      //     setCurrentUser(null);
      //   }
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (user !== null) {
      console.log(user?.email, "user is set");
    } else {
      console.log("no user");
    }
  }, [user]);

  return <AuthContext.Provider value={{ user, googleSignIn, logOut }}>{children}</AuthContext.Provider>;
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
