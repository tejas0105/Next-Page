import React from "react";
import {
  TwitterShareButton,
  TwitterIcon,
  FacebookShareButton,
  FacebookIcon,
  WhatsappShareButton,
  WhatsappIcon,
  LinkedinShareButton,
  LinkedinIcon,
} from "react-share";

interface SharesProps {
  url: string;
  title: string;
}

const Shares = ({ url, title }: SharesProps) => {
  return (
    <div className="flex flex-col">
      <div className="flex mb-5 h-9 items-center">
        <TwitterShareButton url={url} title={title}>
          <TwitterIcon size={32} round />
        </TwitterShareButton>
        <h2 className="ml-4">Share on Twitter</h2>
      </div>
      <div className="mb-5 flex h-9 items-center">
        <FacebookShareButton url={url} title={title}>
          <FacebookIcon size={32} round />
        </FacebookShareButton>
        <h2 className="ml-4">Share on Facebook</h2>
      </div>
      <div className="mb-5 flex h-9 items-center">
        <WhatsappShareButton url={url} title={title}>
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>
        <h2 className="ml-4">Share on Whatsapp</h2>
      </div>
      <div className="mb-5 flex h-9 items-center">
        <LinkedinShareButton url={url} title={title}>
          <LinkedinIcon size={32} round />
        </LinkedinShareButton>
        <h2 className="ml-4">Share on Linkedin</h2>
      </div>
    </div>
  );
};

export default Shares;
