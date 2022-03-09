import React, { useState, useContext, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./UploadForm.css";
import ProgressBar from "./ProgressBar";
import { ImageContext } from "../context/ImageContext";

const UploadForm = () => {
  const { images, setImages, setMyImages } = useContext(ImageContext);
  const [files, setFiles] = useState(null);

  const [previews, setPreviews] = useState([]);

  const [percent, setPercent] = useState(0);
  const [isPublic, setIsPublic] = useState(true);
  const inputRef = useRef();

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

  const onSubmitV2 = async (e) => {
    e.preventDefault();
    try {
      const presignedData = await axios.post(
        "http://localhost:5555/images/presigned",
        {
          contentTypes: [...files].map((file) => file.type),
        }
      );

      const result = await Promise.all(
        [...files].map((file, index) => {
          const { presigned } = presignedData.data[index];
          const formData = new FormData();
          for (const key in presigned.fields) {
            formData.append(key, presigned.fields[key]);
          }
          formData.append("Content-Type", file.type);
          formData.append("file", file);
          return axios.post(presigned.url, formData);
        })
      );

      const res = await axios.post("http://localhost:5555/images", {
        images: [...files].map((file, index) => ({
          imageKey: presignedData.data[index].imageKey,
          originalname: file.originalname,
        })),
        public: isPublic,
      });
      if (isPublic) setImages([...res.data, ...images]);
      setMyImages([...res.data, ...images]);

      toast.success("Upload Success!");
      setTimeout(() => {
        setPercent(0);
        setPreviews([]);
      }, 3000);
    } catch (err) {
      console.error(err);
      toast.error(err.response.data.message);
      setPercent(0);
      setPreviews([]);
    }
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
        setPreviews([]);
      }, 3000);
      if (isPublic) setImages([...res.data, ...images]);
      setMyImages([...res.data, ...images]);
      inputRef.current.value = null;
      toast.success(res.data.result);
    } catch (err) {
      setPercent(0);
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
    <form onSubmit={onSubmitV2}>
      <div className="image-priview-container">{previewImages}</div>
      <ProgressBar percent={percent} />
      <div className="file-dropper">
        {fileName}
        <input
          ref={(ref) => (inputRef.current = ref)}
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
