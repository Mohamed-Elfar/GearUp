import React from "react";
import { useTranslation } from "react-i18next";

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <div
      className="w-full bg-blue-25 bg-cover bg-primary-50 py-4 lg:py-5 flex flex-col lg:flex-row gap-6 md:gap-12 lg:gap-36 items-center lg:px-24 xl:px-16 2xl:px-48"
      style={{
        backgroundImage: "url('/assets/default/img/home/hero-background.jpg')",
      }}
    >
      {/* Left Text Section */}
      <div className="flex flex-col items-center lg:items-start sm:text-center lg:text-start gap-3 3xl:ms-auto">
        <p className="text-lg md:text-2xl lg:text-4xl xl:text-5xl text-pure-turquoise font-bold">
          {t("hero.title")}
        </p>

        <p className="text-base md:text-lg lg:text-xl xl:text-2xl text-sky-950 font-semibold max-w-3xl">
          {t("hero.subtitle")}
        </p>

        <div className="mt-4 flex flex-wrap justify-center lg:justify-start md:text-cente gap-2">
          <a
            href="#learningSolutions"
            className="bg-primary-500 text-white px-10 py-3 rounded hover:bg-primary-700 transition font-semibold"
          >
            {t("hero.cta")}
          </a>
        </div>
      </div>

      {/* Right Avatar Section */}
      <div
        dir="ltr"
        className="flex flex-col gap-y-2 mb-11 3xl:me-auto justify-center"
      >
        <div className="flex gap-x-2">
          <div className="relative flex pt-7 w-32 h-32 md:w-48 md:h-48 xl:w-56 xl:h-56 mt-4 rounded-tl-[50%] border-8 border-white bg-pastel-blue">
            <img
              className="mx-auto w-auto h-auto"
              width="180"
              height="180"
              loading="lazy"
              src="/images/people1.png"
              alt="person-1"
            />
          </div>

          <div className="flex pt-7 w-32 h-32 md:w-48 md:h-48 xl:w-56 xl:h-56 border-8 border-white bg-pastel-yellow">
            <img
              className="mx-auto w-auto h-auto"
              width="180"
              height="180"
              loading="lazy"
              src="/images/people2.png"
              alt="person-2"
            />
          </div>
        </div>

        <div className="flex gap-x-2">
          <div className="relative flex pt-7 w-32 h-32 md:w-48 md:h-48 xl:w-56 xl:h-56 rounded-bl-[50%] border-8 border-white bg-pastel-green">
            <img
              className="mx-auto w-auto h-auto"
              width="180"
              height="180"
              loading="lazy"
              src="/images/people3.png"
              alt="person-3"
            />
          </div>

          <div className="relative flex pt-7 w-32 h-32 md:w-48 md:h-48 xl:w-56 xl:h-56 -mt-4 rounded-br-[50%] border-8 border-white bg-pastel-blue">
            <img
              loading="lazy"
              className="absolute top-20 -end-4 lg:top-36 lg:start-36 xl:start-44 w-16 h-16 animate-pulse"
              src="/images/ai.svg"
              alt="ai-icon"
            />
            <img
              className="mx-auto w-auto h-auto"
              width="180"
              height="180"
              loading="lazy"
              src="/images/people4.png"
              alt="person-4"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
