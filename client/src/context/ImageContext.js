import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const ImageContext = createContext();

export const ImageProvider = (prop) => {
  const [images, setImages] = useState([]);
  const [myImages, setMyImages] = useState([]);
  const [isPublic, setIsPublic] = useState(true);
  const [me] = useContext(AuthContext); // index.js의 ImageProvider가 AuthProvider 하위에 있으니 불러올 수 있다.

  useEffect(() => {
    axios
      .get("http://localhost:5555/images")
      .then((result) => setImages(result.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (me) {
        axios
          .get("http://localhost:5555/users/me/images")
          .then((result) => setMyImages(result.data))
          .catch((err) => console.error(err));
      } else {
        setMyImages([]);
        setIsPublic(false);
      }
    }, 0);
  }, [me]);

  return (
    <ImageContext.Provider
      value={{
        images,
        setImages,
        myImages,
        setMyImages,
        isPublic,
        setIsPublic,
      }}
    >
      {prop.children}
    </ImageContext.Provider>
  );
};
