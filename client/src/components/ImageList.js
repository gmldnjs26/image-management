import React, { useEffect, useState } from 'react'
import axios from 'axios'

const ImageList = () => {
  const [images, setImages] = useState([]);
  useEffect(()=>{
    axios
    .get("http://localhost:5555/images")
    .then((result) => setImages(result.data))
    .catch((err) => console.log(err));
  }, []);
  const imgList = images.map((image) => (<img key={image.key} style={{ width:'100%' }} alt="" src={`http://localhost:5555/uploads/${image.key}`} />))
  return (
    <div>
      <h3>ImageList</h3>
      {imgList}
    </div>
  );
}

export default ImageList