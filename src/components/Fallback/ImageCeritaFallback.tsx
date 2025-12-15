import React, { useState } from "react";
import CeritaFallback from "../../assets/img/cerita.png";

export function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [didError, setDidError] = useState(false);

  const { src, alt, className, style, ...rest } = props;

  return (
    <img
      src={didError ? CeritaFallback : src}
      alt={alt}
      className={className}
      style={style}
      onError={() => setDidError(true)}
      {...rest}
    />
  );
}
