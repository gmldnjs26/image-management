import React, { useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ImageContext } from "../context/ImageContext";
import "./ImageList.css";

const ImageList = () => {
  const {
    images,
    myImages,
    isPublic,
    setIsPublic,
    loaderMoreImages,
    imageLoading,
    imageError,
  } = useContext(ImageContext);

  const elementRef = useRef(null);

  useEffect(() => {
    if (!elementRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      console.log("intersection", entry.isIntersecting);
      if (entry.isIntersecting) loaderMoreImages();
    });
    observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [loaderMoreImages]);

  const imgList = isPublic
    ? images.map((image, index) => (
        <Link
          key={image.key}
          to={`/images/${image._id}`}
          ref={index === images.length - 5 ? elementRef : undefined}
        >
          <img
            key={image.key}
            alt=""
            src={`http://localhost:5555/uploads/${image.key}`}
          />
        </Link>
      ))
    : myImages.map((image, index) => (
        <Link
          key={image.key}
          to={`/images/${image._id}`}
          ref={index === myImages.length - 5 ? elementRef : undefined}
        >
          <img
            key={image.key}
            alt=""
            src={`http://localhost:5555/uploads/${image.key}`}
          />
        </Link>
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
      <div className="img-list-container">{imgList}</div>
      {imageLoading ? (
        <div>Loading..</div>
      ) : (
        <button onClick={() => loaderMoreImages()}>이미지 더보기</button>
      )}
    </div>
  );
};

export default ImageList;
