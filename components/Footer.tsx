import { IconBrandGithub, IconBrandTwitter } from "@tabler/icons-react";
import { FC } from "react";

export const Footer: FC = () => {
  return (
    <div className="flex h-[50px] py-2 px-8 items-center justify-center">
      <div className="flex space-x-4">
        <a
          className="flex items-center hover:opacity-50"
          href="https://twitter.com/aqilmarwann"
          target="_blank"
          rel="noreferrer"
        >
          <IconBrandTwitter size={30} />
        </a>

        <a
          className="flex items-center hover:opacity-50"
          href="https://github.com/aqilmarwan"
          target="_blank"
          rel="noreferrer"
        >
          <IconBrandGithub size={30} />
        </a>
      </div>
    </div>
  );
};
