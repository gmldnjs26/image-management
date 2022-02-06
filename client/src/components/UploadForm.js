import React, { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./UploadForm.css";
import ProgressBar from "./ProgressBar";
import { ImageContext } from "../context/ImageContext";

const UploadForm = () => {
  const { images, setImages, myImages, setMyImages } = useContext(ImageContext);
  const [files, setFiles] = useState(null);

  const [previews, setPreviews] = useState([]);

  const [percent, setPercent] = useState(0);
  const [isPublic, setIsPublic] = useState(true);

  const imageSelectHandler = async (e) => {
    const imageFiles = e.target.files;
    setFiles(imageFiles);

    const imagePreviews = await Promise.all(
      [...imageFiles].map((imageFile) => {
        return new Promise((resolve, reject) => {
          try {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(imageFile);
            fileReader.onload = (e) =>
              resolve({ imgSrc: e.target.result, fileName: imageFile.name });
          } catch (err) {
            reject(err);
          }
        });
      })
    );
    setPreviews(imagePreviews);
  };
  const onSubmit = async (e) => {
    e.preventDefault(); // 새로고침 안함
    const formData = new FormData();
    if (files == null) {
      toast.info("파일을 등록해주세요");
      return;
    }
    formData.append("public", isPublic);
    for (let file of files) formData.append("image", file);
    try {
      const res = await axios.post("http://localhost:5555/images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          setPercent(Math.round((100 * e.loaded) / e.total));
        },
      });
      setTimeout(() => {
        setPercent(0);
      }, 3000);
      setPreviews([]);
      if (isPublic) {
        setImages([...images, ...res.data]);
      } else {
        setMyImages([...myImages, ...res.data]);
      }
      toast.success(res.data.result);
    } catch (err) {
      setPreviews([]);
      toast.error(err.response.data.message);
    }
  };
  const previewImages = previews.map((preview, index) => (
    <img
      key={index}
      alt=""
      className={`image-preview ${preview.imgSrc ? "" : "hidden"}`}
      src={preview.imgSrc}
    />
  ));

  const fileName =
    previews.length === 0
      ? "이미지를 업로드 해주세요"
      : previews.reduce((pre, cur) => pre + " " + cur.fileName, "");

  return (
    <form onSubmit={onSubmit}>
      {previewImages}
      <ProgressBar percent={percent} />
      <div className="file-dropper">
        {fileName}
        <input
          id="image"
          accept="image/*"
          type="file"
          multiple
          onChange={imageSelectHandler}
        />
      </div>
      <input
        type="checkbox"
        id="public-check"
        value={!isPublic}
        onChange={() => setIsPublic(!isPublic)}
      />
      <label htmlFor="public-check">비공개</label>
      <button type="submit">제출</button>
    </form>
  );
};

export default UploadForm;
