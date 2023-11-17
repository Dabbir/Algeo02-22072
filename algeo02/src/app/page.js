import BackgroundComponent from "@/components/BackgroundBox";
import Navbar from "@/components/Navbar";
import { Orbitron } from "next/font/google";
import Link from "next/link";

const orbitron = Orbitron({
  weight: ["400", "500", "800"],
  subsets: ["latin"],
});

const Home = () => {
  return (
    <main>
      <Navbar />
      <div className="backgroundAmim absolute -z-10 top-0 left-0 w-full h-40 bg-blue-500 filter blur-60 animate-animBack"></div>
      <div className="w-full min-h-[100vh] mx-auto flex flex-col justify-between backdrop-blur-sm">
        <div className="fixed">
          <BackgroundComponent />
        </div>
        <section className="flex flex-col z-10 m-[36vh] items-center justify-center h-4/5 font-semibold">
          <div className={`text-center ${orbitron.className}`}>
            <h1 className="text-6xl mb-4">
              <span className="text-secondary">Reverse</span> Image Search
            </h1>
            <p className="text-lg mb-8">
              Fast Track Your Web Development Career with Our Team! <br />
              Learn Web Development from Beginning with live coding sessions on
              your Laptop!
            </p>
            <Link
              href="/aboutus"
              className="border-white border-4 rounded-sm py-2 px-4 mx-4 hover:bg-white hover:text-senary"
              style={{ "--i": "#fff" }}
            >
              About Us
            </Link>
            <Link
              href="/search"
              className="border-secondary text-secondary border-4 rounded-sm py-2 px-4 mx-4 hover:bg-secondary hover:text-senary"
              style={{ "--i": "#00bfff" }}
            >
              EXPLORE
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Home;