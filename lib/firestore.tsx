import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';


const isDev = false;
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: isDev ? process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN_DEV : process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const auth = getAuth();
const provider = new GoogleAuthProvider();

export const signIn = () => {
     signInWithRedirect(auth, provider)
    
    // .then((result) => {
    //     // This gives you a Google Access Token. You can use it to access the Google API.
    //     console.log('result', result)
    //     const credential = GoogleAuthProvider.credentialFromResult(result);
    //     console.log('credential', credential)
    //     const token = credential?.accessToken;
    //     // The signed-in user info.
    //     const user = result.user;
    //     // IdP data available using getAdditionalUserInfo(result)
    //     console.log(token, user, 'i am getting a token back ')
        
    //     // ...
    //   }).catch((error) => {
    //     // Handle Errors here.
    //     const errorCode = error.code;
    //     const errorMessage = error.message;
    //     // The email of the user's account used.
    //     const email = error.customData.email;
    //     // The AuthCredential type that was used.
    //     const credential = GoogleAuthProvider.credentialFromError(error);
    //     // ...
    //     console.log(errorCode, errorMessage, email);
    //   });
}




