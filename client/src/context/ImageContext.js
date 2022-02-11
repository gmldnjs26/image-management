import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
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

  useEffect(() => {
    setImageLoading(true);
    axios
      .get(`http://localhost:5555${imageUrl}`)
      .then((result) => setImages((prevData) => [...prevData, ...result.data]))
      .catch((err) => {
        setImageError(true);
        console.log(err);
      })
      .finally(() => setImageLoading(false));
  }, [imageUrl]);

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

  const lastImageId = images.length > 0 ? images[images.length - 1]._id : null;

  const loaderMoreImages = useCallback(() => {
    if (imageLoading || !lastImageId) return;
    setImageUrl(`/images?lastId=${lastImageId}`);
  }, [lastImageId, imageLoading]);

  return (
    <ImageContext.Provider
      value={{
        images,
        setImages,
        myImages,
        setMyImages,
        isPublic,
        setIsPublic,
        loaderMoreImages,
        imageLoading,
        imageError,
      }}
    >
      {prop.children}
    </ImageContext.Provider>
  );
};
