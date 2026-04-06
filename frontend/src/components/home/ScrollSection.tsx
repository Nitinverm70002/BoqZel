"use client";
import React from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import Image from "next/image";

export default function ScrollSection() {
  return (
    <section className="flex flex-col overflow-hidden bg-black py-20" id="vision-section">
      <ContainerScroll
        titleComponent={
          <>
            <h2 className="text-4xl font-semibold text-white dark:text-white">
              Unleash the power of <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
                BoqZel Intelligence
              </span>
            </h2>
          </>
        }
      >
        <Image
          src="/images/stays-itinerary.png"
          alt="BoqZel Stays and Itinerary"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>
    </section>
  );
}
