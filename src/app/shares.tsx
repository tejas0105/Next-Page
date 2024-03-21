import React from "react";
import {
  TwitterShareButton,
  TwitterIcon,
  FacebookShareButton,
  FacebookIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from "react-share";

interface SharesProps {
  url: string;
  title: string;
}

const Shares = ({ url, title }: SharesProps) => {
  return (
    <div>
      <TwitterShareButton
        url={url}
        title={title}
        className="Demo__some-network__share-button"
      >
        <TwitterIcon size={32} round />
      </TwitterShareButton>
      <FacebookShareButton url={url} title={title}>
        <FacebookIcon size={32} round />
      </FacebookShareButton>
      <WhatsappShareButton url={url} title={title}>
        <WhatsappIcon size={32} round />
      </WhatsappShareButton>
    </div>
  );
};

export default Shares;
