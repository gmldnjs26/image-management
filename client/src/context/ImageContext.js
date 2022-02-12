import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef,
} from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const ImageContext = createContext();

export const ImageProvider = (prop) => {
  const [images, setImages] = useState([]);
  const [myImages, setMyImages] = useState([]);
  const [isPublic, setIsPublic] = useState(true);
  const [imageUrl, setImageUrl] = useState("/images");
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [me] = useContext(AuthContext); // index.js의 ImageProvider가 AuthProvider 하위에 있으니 불러올 수 있다.
  const pastImageUrlRef = useRef();

  useEffect(() => {
    if (pastImageUrlRef.current === imageUrl) return;
    setImageLoading(true);
    axios
      .get(`http://localhost:5555${imageUrl}`)
      .then((result) =>
        isPublic
          ? setImages((prevData) => [...prevData, ...result.data])
          : setMyImages((prevData) => [...prevData, ...result.data])
      )
      .catch((err) => {
        setImageError(true);
        console.log(err);
      })
      .finally(() => {
        setImageLoading(false);
        pastImageUrlRef.current = imageUrl;
      });
  }, [imageUrl, isPublic]);

  useEffect(() => {
    setTimeout(() => {
      if (me) {
        axios
          .get("http://localhost:5555/users/me/images")
          .then((result) => setMyImages(result.data))
          .catch((err) => console.error(err));
      } else {
        setMyImages([]);
        setIsPublic(true);
      }
    }, 0);
  }, [me]);

  return (
    <ImageContext.Provider
      value={{
        images: isPublic ? images : myImages,
        setImages: isPublic ? setImages : setMyImages,
        isPublic,
        setIsPublic,
        imageLoading,
        imageError,
        setImageUrl,
      }}
    >
      {prop.children}
    </ImageContext.Provider>
  );
};
