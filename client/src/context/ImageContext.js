import React, {createContext, useState, useEffect} from 'react'
import axios from 'axios'

export const ImageContext = createContext()

export const ImageProvider = (prop) => {
  const [images, setImages] = useState([])

  useEffect(()=>{
    axios
    .get("http://localhost:5555/images")
    .then((result) => setImages(result.data))
    .catch((err) => console.log(err));
  }, []);

  return (
    <ImageContext.Provider value={[images, setImages]}>
      {prop.children}
    </ImageContext.Provider>
  )
}