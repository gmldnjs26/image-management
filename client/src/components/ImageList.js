import React, { useContext, useState } from "react";
import { ImageContext } from "../context/ImageContext";
import "./ImageList.css";

const ImageList = () => {
  const { images, myImages, isPublic, setIsPublic } = useContext(ImageContext);

  const imgList = (isPublic ? images : myImages).map((image) => (
    <img
      key={image.key}
      alt=""
      src={`http://localhost:5555/uploads/${image.key}`}
    />
  ));
  return (
    <div>
      <h3>ImageList({isPublic ? "공개사진" : "개인사진"})</h3>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          margin: "10px",
        }}
      >
        <button
          onClick={() => setIsPublic(!isPublic)}
          style={{ width: "100px" }}
        >
          {isPublic ? "개인" : "공개"} 사진보기
        </button>
      </div>
      <div class="img-list-container">{imgList}</div>
    </div>
  );
};

export default ImageList;
