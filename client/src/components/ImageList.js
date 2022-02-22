import React, { useContext, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { ImageContext } from "../context/ImageContext";
import "./ImageList.css";

const ImageList = () => {
  const {
    images,
    isPublic,
    setIsPublic,
    imageLoading,
    imageError,
    setImageUrl,
  } = useContext(ImageContext);

  const elementRef = useRef(null);

  const loaderMoreImages = useCallback(() => {
    const lastImageId =
      images.length > 0 ? images[images.length - 1]._id : null;
    if (imageLoading || !lastImageId) return;
    setImageUrl(
      isPublic
        ? `/images?lastId=${lastImageId}`
        : `/users/me/images?lastId=${lastImageId}`
    );
  }, [images, imageLoading, isPublic, setImageUrl]);

  useEffect(() => {
    if (!elementRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      console.log("intersection", entry.isIntersecting);
      if (entry.isIntersecting) loaderMoreImages();
    });
    observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [loaderMoreImages]);

  const imgList = images.map((image, index) => (
    <Link
      key={image.key}
      to={`/images/${image._id}`}
      ref={index === images.length - 5 ? elementRef : undefined}
    >
      <img
        key={image.key}
        alt=""
        src={`https://first-image-storage.s3.ap-northeast-1.amazonaws.com/raw/${image.key}`}
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
