import { FC } from "react";
import Image from "next/image";
import gamespot from "../public/favicon.svg";

export const Navbar: FC = () => {
  return (
    <div className="flex h-[60px] py-8 px-8 items-center justify-between">
      <div className="font-bold text-2xl flex items-center">
        <a
          className="flex hover:opacity-50 items-center"
          href="https://gamespot-gpt.vercel.app"
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
          href="https://www.gamespot-gpt.com"
          target="_blank"
          rel="noreferrer"
        >
          <span className="pr-2">Visit GameSpot {" "}</span>
          <div>
            <span aria-hidden="true">&rarr;</span>
          </div>
        </a>
      </div>
    </div>
  );
};
