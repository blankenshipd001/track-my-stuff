import Header from "@/lib/movies/header";
import Footer from "@/lib/shared/footer";

const BooksApp = () => {
 
  return (
    <>
      <Header />
      <main className="lg:flex min-h-screen flex-col items-center justify-between p-6 font-mono text-sm ">
        <div className="flex-grow">
          Books App
        </div>
      </main>
      <Footer />
    </>
  );
};

export default BooksApp;
