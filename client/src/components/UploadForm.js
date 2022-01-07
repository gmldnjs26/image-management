import React, { useState }  from "react";
import axios from 'axios'
import { toast } from 'react-toastify'
import './UploadForm.css'
import ProgressBar from "./ProgressBar";

const UploadForm = () => {
  const defaultFileName = "이미지 파일을 업로드 해주세요"
  const [file, setFile] = useState(null);
  const [imgSrc, setImgSrc] = useState(null)
  const [fileName, setFileName] = useState(defaultFileName);
  const [percent, setPercent] = useState(0);

  const imageSelectHandler = (e) => {
    const imageFile = e.target.files[0];
    setFile(imageFile)
    setFileName(imageFile.name)
    const fileReader = new FileReader();
    fileReader.readAsDataURL(imageFile)
    fileReader.onload = e => setImgSrc(e.target.result)
  }
  const onSubmit = async (e) => {
    e.preventDefault(); // 새로고침 안함
    const formData = new FormData();
    if(file == null) {
      toast.info('파일을 등록해주세요')
      return ;
    }
    formData.append("image", file)
    try {
      const res = await axios.post("http://localhost:5555/images", formData, {
        headers: {"Content-Type":"multipart/form-data"},
        onUploadProgress: (e) => {
          setPercent(Math.round((100 * e.loaded) / e.total));
        }
      })
      setTimeout(() => {
        setPercent(0)
      }, 3000);
      setFileName(defaultFileName)
      setImgSrc(null)
      toast.success(res.data.result)
    } catch(err) {
      setFileName(defaultFileName)
      setImgSrc(null)
      toast.error(err.message)
    }
  }
  return (
    <form onSubmit={onSubmit}>
      <img className={`image-preview ${imgSrc ? '' : 'hidden'}`} src={imgSrc} />
      <ProgressBar percent={percent} />
      <div className="file-dropper">
        {fileName}
        <input 
          id="image"
          accept="image/*"
          type="file"
          onChange={imageSelectHandler}
        />
      </div>
      <button type="submit">제출</button>
    </form>
  )
}

export default UploadForm