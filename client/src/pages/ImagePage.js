import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ImageContext } from "../context/ImageContext";
import axios from "axios";
import { toast } from "react-toastify";

const ImagePage = () => {
  const navigate = useNavigate();
  const { imageId } = useParams();
  const { images, setImages, setMyImages } = useContext(ImageContext);
  const [me] = useContext(AuthContext);
  const [hasLiked, setHasLiked] = useState(false);
  const [image, setImage] = useState();

  useEffect(() => {
    axios
      .get(`http://localhost:5555/images/${imageId}`)
      .then((result) => {
        console.log(result);
        setImage(result.data);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        console.error(err);
      });
  }, [imageId]);

  useEffect(() => {
    if (me && image && image.likes.includes(me.userId)) setHasLiked(true);
  }, [me, image]);

  const updateImages = (images, image) => {
    return [...images.filter((image) => image._id !== imageId), image].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  };

  const onSubmit = async () => {
    const result = await axios.patch(
      `http://localhost:5555/images/${imageId}/${hasLiked ? "unlike" : "like"}`
    );
    console.log(result);
    if (result.data.public) {
      setImages(updateImages(images, result.data));
    }
    setMyImages(updateImages(images, result.data));
    setHasLiked(!hasLiked);
  };

  const deleteHandler = async () => {
    try {
      if (!window.confirm("삭제하시겠습니까?")) return;
      const result = await axios.delete(
        `http://localhost:5555/images/${imageId}`
      );
      toast.success(result.data.message);
      setImages(images.filter((image) => image._id !== imageId));
      setMyImages(images.filter((image) => image._id !== imageId));
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (!image) return <h3>Loading..</h3>;
  return (
    <div>
      <h3>Image Page - {imageId}</h3>
      <img
        alt={imageId}
        src={`http://localhost:5555/uploads/${image.key}`}
        style={{ width: "100%", height: "auto" }}
      />
      <span>좋아요 {image.likes.length}</span>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "10px",
        }}
      >
        <button onClick={onSubmit} style={{ width: "80px" }}>
          {hasLiked ? "좋아요 취소" : "좋아요"}
        </button>
        {me && image.user._id === me.userId && (
          <button style={{ width: "80px" }} onClick={deleteHandler}>
            삭제
          </button>
        )}
      </div>
    </div>
  );
};

export default ImagePage;
