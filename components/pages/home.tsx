"use client";

import { BackgroundNoise } from "../backgrounds";
import Navbar from "../sections/navbar";

const HomePage = () => {
  return (
    <div className="no-scrollbar portfolio-container relative size-full snap-y snap-mandatory overflow-y-scroll">
      <BackgroundNoise className="z-50" />
      <main>
        <Navbar />
      </main>
    </div>
  );
};

export default HomePage;
