// Roadmap.tsx
import {
  RoadMapDashedLine,
  RoadMapDashedLineLast,
  RoadMapDashedLineMobile,
} from "@/icon";
import React from "react";

interface RoadmapItem {
  date: string;
  title: string;
  description: string;
  tasks: string[];
}

const roadmapData: RoadmapItem[] = [
  {
    date: "AUGUST 2024",
    title: "Idea Generation",
    description:
      "Build flexible savings portfolios and maximize crypto assets to meet your financial goals.",
    tasks: ["Home page design", "Dashboard design", "Icon page design"],
  },
  {
    date: "SEPTEMBER 2024",
    title: "Savings Options",
    description:
      "We provide a transparent, secure, customised and flexible savings system, which supports multiple crypto assets.",
    tasks: ["Home page design", "Dashboard design", "Dashboard design"],
  },
  {
    date: "OCTOBER 2024",
    title: "Borrowing out to compound finance",
    description:
      "We provide a transparent, secure, customised and flexible savings system, which supports multiple crypto assets.",
    tasks: ["Home page design", "Home page design", "Home page design"],
  },
  {
    date: "NOVEMBER 2024",
    title: "Liquidation Protection",
    description:
      "We provide a transparent, secure, customised and flexible savings system, which supports multiple crypto assets.",
    tasks: ["Home page design", "Home page design", "Home page design"],
  },
  {
    date: "Q1 2025",
    title: "ICO & Rewards systems",
    description:
      "We provide a transparent, secure, customised and flexible savings system, which supports multiple crypto assets.",
    tasks: ["Home page design", "Home page design", "Home page design"],
  },
];

const Roadmap: React.FC = () => {
  return (
    <div className="flex flex-col items-center  text-neutral-3 pb-10 ">
      <p className="text-center mb-8 text-xl md:text-base ">
        Build flexible savings portfolios and maximize crypto assets to meet
        your financial goals
      </p>

      {roadmapData.map((item, index) => (
        <div
          key={index}
          className="flex flex-col gap-2 md:gap-4 md:flex-row w-full text-neutral-3 lg:my-4 mb-12 lg:mb-0 "
        >
          <h2
            className={`lg:text-lg font-light text-center md:w-2/5 lg:w-2/6 ${
              index < 2 ? "text-secondry-4" : "ext-neutral-3"
            } `}
          >
            {item.date}
          </h2>

          <div className="flex flex-col md:flex-row md:gap-4 md:w-3/5 lg:w-4/6">
            <div className="flex flex-col items-center">
              {index < 2 ? (
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 64 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 lg:h-16 lg:w-16"
                >
                  <circle cx="32.0001" cy="32" r="20.6452" fill="#FFD700" />
                  <circle
                    cx="32"
                    cy="32"
                    r="30.5"
                    stroke="white"
                    stroke-width="3"
                  />
                </svg>
              ) : (
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 64 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 lg:h-16 lg:w-16"
                >
                  <circle
                    cx="32.0001"
                    cy="32.0001"
                    r="20.6452"
                    fill="#C4C4C4"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="30.5"
                    stroke="#C4C4C4"
                    stroke-width="3"
                  />
                </svg>
              )}

              <div className={`hidden md:block `}>
                <RoadMapDashedLine />
              </div>

              {/* <div
                className={`hidden  ${
                  index !== roadmapData.length - 1 ? "md:block" : "hidden"
                }`}
              >
                <RoadMapDashedLine />
              </div>

              <div
                className={`hidden  ${
                  index === roadmapData.length - 1 ? "hidden" : "md:block"
                }`}
              > 
                <RoadMapDashedLineLast />
              </div>*/}

              <div className=" md:hidden">
                <RoadMapDashedLineMobile />
              </div>
            </div>
            <div className="text-center md:text-left">
              <h2 className="font-semibold text-white text-lg md:text-xl lg:text-2xl leading-loose mb-2 md:mb-6">
                {item.title}
              </h2>
              <p className=" md:text-lg lg:text-xl font-light">
                {item.description}
              </p>

              <div className=" mt-4 space-y-1  md:text-md  flex-row gap-4 font-light">
                {item.tasks.map((task, taskIndex) => (
                  <p
                    key={taskIndex}
                    className="flex items-center justify-center md:justify-start gap-2  "
                  >
                    {index < 2 ? (
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 lg:h-6 lg:w-6"
                      >
                        <circle cx="12" cy="12" r="12" fill="white" />
                        <path
                          d="M17.3334 8L10.0001 15.3333L6.66675 12"
                          stroke="#0D0D0D"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 lg:h-6 lg:w-6"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="11"
                          stroke="white"
                          stroke-width="2"
                        />
                        <path
                          d="M8 11.5H16"
                          stroke="white"
                          stroke-width="2"
                          stroke-linecap="round"
                        />
                      </svg>
                    )}

                    {task}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Roadmap;
