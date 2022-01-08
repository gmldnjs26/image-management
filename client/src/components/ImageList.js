import React, { useContext } from 'react'
import { ImageContext } from '../context/ImageContext'

const ImageList = () => {
  const [images] = useContext(ImageContext)
  const imgList = images.map(
    (image) => (<img key={image.key} style={{ width:'100%' }} alt="" src={`http://localhost:5555/uploads/${image.key}`} />)
  )
  return (
    <div>
      <h3>ImageList</h3>
      {imgList}
    </div>
  );
}

export default ImageList