import { auth } from "@/config/firebase";
import { User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const useUserSession= (initialUser: User) => {
    // The initialUser comes from the server through a server component
    const [user, setUser] = useState<User | null>(initialUser);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(authUser => {
            setUser(authUser);
        });
        return () => {
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        auth.onAuthStateChanged(authUser => {
            if (user === undefined) {
                return;
            }
            
            if (user?.email !== authUser?.email) {
                router.refresh();
            }
        });
    }, [user]);

    return user;
}

export default useUserSession;