import React, { FC, ReactNode, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "../api/firestore";

interface Props { children: ReactNode }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AuthContext = React.createContext<any>(null);

export const useAuthContext = () => React.useContext(AuthContext);

export const AuthProvider: FC<Props> = ({ children }: Props) => {
    //TODO how can we type this?
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        onAuthStateChanged(auth, (user: User | null) => {
            if (user) {
                setCurrentUser(user);
            } else {
                setCurrentUser(null);
            }
        });
    }, [currentUser]);

    useEffect(() => {
        if (currentUser !== null) {
        console.log(currentUser.email, 'user is set')
        } else {
            console.log('no user')
        }
    }, [currentUser])

    return (
        <AuthContext.Provider value={{ currentUser }}>
          {children}
        </AuthContext.Provider>
      );
}