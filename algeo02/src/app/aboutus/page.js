import React from "react";
import BackgroundComponent from "@/components/BackgroundBox";
import { Orbitron } from "next/font/google";
import Navbar from "@/components/Navbar";

const orbitron = Orbitron({
    weight: ["400", "500", "800"],
    subsets: ["latin"],
  });
  
function aboutUs (){
  return (
    <main>
        <Navbar />
        <div className="backgroundAmim absolute -z-10 top-0 left-0 w-full h-40 bg-blue-500 filter blur-60 animate-animBack"></div>
        <div className="w-full min-h-[100vh] mx-auto flex flex-col justify-between backdrop-blur-sm">
            <div className="fixed">
                <BackgroundComponent />
            </div>
            <section className="flex flex-col z-10 m-[10vh] items-center justify-center h-4/5 font-semibold">
                <div className={`text-center ${orbitron.className}`}>
                    <h1 className="text-6xl mb-4">
                    <span className="text-secondary">About Us</span> 
                </h1>
                </div>
                <section className="flex flex-row z-10 m-[10vh] items-center justify-center h-4/5 font-semibold">
                    <dev class="card-container"/>
                        <div class="card">
                            <img src="/asset/Dama.jpg" alt="" width="300px" height="300px"/>
                            <div class="text">
                                <div className={`name ${orbitron.className}`}>Ahmad Mudabbir Arif</div>
                                <div className={`nim ${orbitron.className}`}>13522072</div>
                            </div>  
                        </div>
                        <div class="card">
                            <img src="/asset/Cupi.jpg" alt="" width="300px" height="300px"/>
                            <div class="text">
                                <div className={`name ${orbitron.className}`}>Muhammad Neo Cicero Koda</div>
                                <div className={`nim ${orbitron.className}`}>13522108</div>
                            </div>  
                        </div>
                        <div class="card">
                            <img src="/asset/Adril.jpg" alt="" width="300px" height="300px"/>
                            <div class="text">
                                <div className={`name ${orbitron.className}`}>William Glory Henderson</div>
                                <div className={`nim ${orbitron.className}`}>13522113</div>
                            </div>  
                        </div>
                </section>
            </section>
        </div>
    </main>
  );
};

export default aboutUs;
