import Header from "@/lib/shared/header";
import Footer from "@/lib/shared/footer";

const Home = () => {
  return (
    <>
      {/* TODO: Get a better header for the homepage? Maybe share some commonality but we need custom things based on lists */}
      <Header />
      <main className="lg:flex min-h-screen flex-col items-center justify-between p-6 font-mono text-sm ">
        {/* <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex"> */}
        {/* <div className="flex-col"> */}
        <div className="flex-grow mb-auto">
          {/* <Head>
              <title>Code Monkey Movie Watch list</title>
              <meta name="Application created to display a list of movies that are on my watch list" content="Created by code monkey" />
              <link rel="icon" href="/favicon.ico" />
            </Head> */}

          <ul>
            <li>
              <h2>Movies</h2>
            </li>
            <li>
              <h2>Books</h2>
            </li>
          </ul>
        </div>
        {/* </div> */}
        {/* </div> */}
      </main>
      <Footer />
    </>
  );
};

export default Home;
