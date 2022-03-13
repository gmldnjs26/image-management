import React, { useState, useEffect } from "react";

const Image = ({ imageUrl }) => {
  const [isError, setIsError] = useState(false);
  const [hashedUrl, setHasedUrl] = useState(imageUrl);
  useEffect(() => {
    let intervalId;
    if (isError && !intervalId) {
      intervalId = setInterval(
        () => setHasedUrl(`${imageUrl}#${Date.now()}`),
        1000
      );
    } else if (!isError && intervalId) clearInterval(intervalId);
    else setHasedUrl(imageUrl);
    return () => clearInterval(intervalId);
  }, [isError, setHasedUrl, imageUrl]);

  return (
    <img
      alt=""
      onError={() => setIsError(true)}
      onLoad={() => setIsError(false)}
      style={!isError ? { display: "blocked" } : { display: "none" }}
      src={hashedUrl}
    />
  );
};

export default Image;
