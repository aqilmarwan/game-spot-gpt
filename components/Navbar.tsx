import { FC } from "react";
import Image from "next/image";
import gamespot from "../public/favicon.svg";

export const Navbar: FC = () => {
  return (
    <div className="flex h-[60px] py-8 px-8 items-center justify-between">
      <div className="font-bold text-2xl flex items-center">
        <a
          className="flex hover:opacity-50 items-center"
          href="https://wait-but-why-gpt.vercel.app"
        >
          <Image
            src={gamespot}
            alt="The Network State GPT"
            height={40}
          />
        </a>
      </div>
      <div>
        <a
          className="flex items-center hover:opacity-50"
          href="https://www.gamespot.com"
          target="_blank"
          rel="noreferrer"
        >
          <div>Visit GameSpot</div>

        </a>
      </div>
    </div>
  );
};
