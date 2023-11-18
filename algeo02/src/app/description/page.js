"use client"
import React from "react";
import BackgroundComponent from "@/components/BackgroundBox";
import ToggleInfoButton from "@/components/ToggleInfoButton"
import { Orbitron } from "next/font/google";
import Navbar from "@/components/Navbar";

const orbitron = Orbitron({
    weight: ["400", "500", "800"],
    subsets: ["latin"],
  });
  
function description (){
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
                    <ToggleInfoButton/>
                </div>
            </section>
        </div>
    </main>

    
  );
};

export default description;
