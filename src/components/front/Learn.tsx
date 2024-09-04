import React, { useState } from "react";
import { Link, Element, scroller } from "react-scroll";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import ReactPlayer from "react-player";

interface Section {
  title: string;
  subsections: Subsection[];
}

interface Subsection {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
}

const sections: Section[] = [
  {
    title: "New to Web3 start here",
    subsections: [
      {
        id: "whatWallet",
        title: "What is a wallet",
        description:
          "A wallet is like your account number, watch the video to learn more about a wallet and why you need one",
        videoUrl: "https://www.youtube.com/watch?v=SQyg9pyJ1Ac",
      },
      {
        id: "getWallet",
        title: "Get a wallet",
        description:
          "An easy-to-follow guide on how to get and use the Metamask wallet.",
        videoUrl: "https://www.youtube.com/watch?v=-HTubEJ61zU&t",
      },
    ],
  },
  {
    title: "Fund wallet",
    subsections: [
      {
        id: "fundWallet",
        title: "Fund your wallet",
        description:
          "Fund your wallet with assets we support and start saving ASAP",
        videoUrl: "https://www.youtube.com/watch?v=JT9N0EefS7o&t",
      },
    ],
  },
  {
    title: "Create Savings Account",
    subsections: [
      {
        id: "creaeSavingsAccount",
        title: "Create a saving account",
        description:
          "Just like in traditional banking, you need a savings account to save, below is an easy guide on how to create a savings account in few seconds",
        videoUrl: "https://www.youtube.com/watch?v=JT9N0EefS7o&t",
      },
    ],
  },
  {
    title: "Start Saving",
    subsections: [
      {
        id: "startSaving",
        title: "Create a save",
        description:
          "You can save for multiple goals, watch the video on how you create a save, easy peasy",
        videoUrl: "https://www.youtube.com/watch?v=JT9N0EefS7o&t",
      },
    ],
  },
  {
    title: "Asset",
    subsections: [
      {
        id: "addAsset",
        title: "Add Assets to a save",
        description:
          "You can add multiple assets to a save, watch the video on how you can add assets, and meet your goals",
        videoUrl: "https://www.youtube.com/watch?v=JT9N0EefS7o&t",
      },
      {
        id: "topAsset",
        title: "Top up an Asset in a save",
        description:
          "You can add multiple assets to a save, watch the video on how you can add assets, and meet your goals",
        videoUrl: "https://www.youtube.com/watch?v=JT9N0EefS7o&t",
      },
    ],
  },
  {
    title: "Withraw",
    subsections: [
      {
        id: "WithrawAll",
        title: "Withdraw All Asset",
        description:
          "When the lock period for a save is reached, you can withdraw all assets at once, check the video on how to withdraw all assets",
        videoUrl: "https://www.youtube.com/watch?v=JT9N0EefS7o&t",
      },
      {
        id: "WithrawSingle",
        title: "Withdraw Single Asset",
        description:
          "When the lock period for a save is reached, you can withdraw part or all from a single asset, check the video on how to withdraw a single  assets",
        videoUrl: "https://www.youtube.com/watch?v=JT9N0EefS7o&t",
      },
    ],
  },
];

const Learn: React.FC = () => {
  const [activeSubsection, setActiveSubsection] = useState<Subsection | null>(
    sections[0].subsections[0]
  );
  const [expandedSections, setExpandedSections] = useState<string[]>([
    sections[0].title,
  ]);

  const handleSubsectionClick = (subsection: Subsection) => {
    setActiveSubsection(subsection);
    scroller.scrollTo(subsection.id, {
      smooth: true,
      //   offset: -100,
    });
  };

  const toggleSection = (title: string) => {
    if (expandedSections.includes(title)) {
      setExpandedSections(expandedSections.filter((t) => t !== title));
    } else {
      setExpandedSections([...expandedSections, title]);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen text-white lg:h-[500px]">
      {/* Sidebar */}
      <div className="w-full lg:w-1/4 p-4 overflow-auto overflow-y-scroll">
        {sections.map((section, index) => (
          <div key={index} className="mb-6">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection(section.title)}
            >
              <h3 className="text-lg font-bold mb-2">{section.title}</h3>
              {expandedSections.includes(section.title) ? (
                <FaChevronUp className="text-white" />
              ) : (
                <FaChevronDown className="text-white" />
              )}
            </div>
            {expandedSections.includes(section.title) && (
              <ul className="space-y-2 pl-4">
                {section.subsections.map((subsection) => (
                  <li key={subsection.id}>
                    <Link
                      to={subsection.id}
                      smooth={true}
                      offset={-70}
                      className={`cursor-pointer text-neutral-6 ${
                        activeSubsection?.id === subsection.id
                          ? "text-yellow-500"
                          : "hover:text-yellow-500"
                      }`}
                      onClick={() => handleSubsectionClick(subsection)}
                    >
                      {subsection.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 p-4 overflow-auto">
        {activeSubsection ? (
          <Element name={activeSubsection.id}>
            <h2 className="text-xl font-bold mb-2">{activeSubsection.title}</h2>
            <p className="mb-4 text-neutral-3">
              {activeSubsection.description}
            </p>
            <div className="relative aspect-w-16 aspect-h-9">
              <ReactPlayer
                url={activeSubsection.videoUrl}
                className="absolute top-0 left-0"
                controls
              />
            </div>
          </Element>
        ) : (
          <p>Select a subsection to view the details and watch the video.</p>
        )}
      </div>
    </div>
  );
};

export default Learn;
