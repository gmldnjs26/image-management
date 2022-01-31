import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { ImageContext } from "../context/ImageContext";

const ImagePage = () => {
  const { imageId } = useParams();
  const { images, myImages } = useContext(ImageContext);
  const image =
    images.find((image) => image._id === imageId) ||
    myImages.find((image) => image._id === imageId);
  if (!image) return <h3>Loading..</h3>;
  return (
    <div>
      <h3>Image Page - {imageId}</h3>
      <img alt={imageId} src={`http://localhost:5555/uploads/${image.key}`} />
    </div>
  );
};

export default ImagePage;
