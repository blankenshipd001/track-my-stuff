This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

The folder structure and why:
 `/app` -> this folder is your "paths" it's the App Router in NextJs. If there is folder here with a `page.tsx` it'll be a route
 `/lib` -> keep most of the components here and keep `/app` folder clean for only routing 
 `/lib/shared` -> Our version of a component library. Place to keep things that are used in many places.

The testPage folder under `/app` can be used to test out styles and components and can be a catch all for fun things we don't want to lose

### Working on the code

 - install dependencies
 ```bash
 npm install
 ```

 - Run the development environment
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Roboto, a custom Google Font.

## Creating a new page
To create a new page add a folder under the `/app` folder space with a `page.tsx` file. The `page.tsx` is your "landing" page for that site.

## Testing
```bash
npm run test
```

To run tests you can either run `npm run test` to run all tests or if working on them you can run `npm run test:watch` to have them run with every change int he window

## Progressive Web App (PWA)

This app is configured as a PWA, which means users can install it on their devices and use it offline.

### What's Included
- **Service Worker**: Automatically generated in production for offline support
- **Manifest**: App metadata for installation (`/public/manifest.json`)
- **Icons**: Optimized app icons for all devices
- **Offline Mode**: Cached assets work without internet connection

### Testing the PWA Locally

1. Build and start the production server:
```bash
npm run build
npm run start
```

2. Open http://localhost:3000 in your browser

3. Test PWA features:
   - **Chrome DevTools**: Open Application tab → Service Workers to verify registration
   - **Install**: Look for the install button (⊕) in the browser address bar
   - **Offline Mode**: In DevTools Network tab, select "Offline" and reload - the app should still work

### Generating New Icons

If you update the app logo, regenerate PWA icons:
```bash
# Replace public/monkey.png with your new logo first
node generate-icons.js
```

This creates all required icon sizes (192x192, 256x256, 384x384, 512x512, apple-touch-icon, and favicon).

### Production Deployment

When deployed to production (Vercel, etc.), the PWA features activate automatically:
- Service worker registers and caches assets
- Users see an "Install App" prompt
- App works offline after first visit
- Appears in app drawer on mobile devices

### NOTES

 - CSS Fonts
  This was removed from globals.css in favor of trying to use the nextjs optimized fonts
  `@import url("https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap");`
  [`Fonts Doc``](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts)
## Links used:

https://firebase.google.com/docs/web/modular-upgrade#example_2_refactoring_a_function
https://console.cloud.google.com/apis/api/firebasedatabase.googleapis.com/credentials?project=code-monkey-292017
https://travis.media/how-to-use-firebase-with-react/

TODO: some nice setup/styles to use
https://github.com/wdevon99/Next-js-starter/tree/main/src

Building a movies page:
https://www.freecodecamp.org/news/react-movie-app-tutorial/

Icons page 
https://fonts.google.com/icons?selected=Material+Symbols+Outlined:home:FILL@0;wght@400;GRAD@0;opsz@48

https://heroicons.com/


https://www.themoviedb.org/settings/api
https://www.themoviedb.org/login?to=read_me&redirect_uri=/docs
https://www.themoviedb.org/settings/api/details


https://www.themoviedb.org/about/logos-attribution

## TODOs
 - Update to allow easy updating of the season and episode when on mobile screens
 - Make the tiles on the MyWatchlist tapable for edit especially on mobile screens
 - Make it so the legend can be dismissed and brought back up
 - Make it so the legend is populated by your list of providers
 - Make a way to save your list of providers
 - Make a way to know what providers a show is available on
 - Make a way to select which provider you're watching from
 - Make the "Add Title" on MyWatchlist.tsx actually search for titles and add them to the watchlist
 - 

## ISSUES
