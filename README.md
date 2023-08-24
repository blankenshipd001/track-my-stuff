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
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Roboto, a custom Google Font.

## Creating a new page
To create a new page add a folder under the `/app` folder space with a `page.tsx` file. The `page.tsx` is your "landing" page for that site.


## Testing
To run tests you can either run `npm run test` to run all tests or if working on them you can run `npm run test:watch` to have them run with every change int he window

Currently tests are being added to the `__tests__` folder however this can be changed in the future if we decide.


### NOTES / TODOs

 - CSS Fonts
  This was removed from globals.css in favor of trying to use the nextjs optimized fonts
  `@import url("https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap");`
  [`Fonts Doc``](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts)
## Links used:

https://firebase.google.com/docs/web/modular-upgrade#example_2_refactoring_a_function
https://console.cloud.google.com/apis/api/firebasedatabase.googleapis.com/credentials?project=code-monkey-292017
https://travis.media/how-to-use-firebase-with-react/


Building a movies page:
https://www.freecodecamp.org/news/react-movie-app-tutorial/

Icons page 
https://fonts.google.com/icons?selected=Material+Symbols+Outlined:home:FILL@0;wght@400;GRAD@0;opsz@48

https://heroicons.com/


https://www.themoviedb.org/settings/api
https://www.themoviedb.org/login?to=read_me&redirect_uri=/docs
https://www.themoviedb.org/settings/api/details


https://www.themoviedb.org/about/logos-attribution

https://app.flagsmith.com/project/11256/environment/DeXpwrBU9vViXjt3ZrwJK2/features

Global State provider with Gastby: https://dev.to/changoman/gatsby-js-global-state-w-react-context-usereducer-3c1

## ISSUES
Currently @testing-library/jest-dom v6.X has an issue with expect not known so we are on @5.16