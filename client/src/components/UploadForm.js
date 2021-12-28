import React  from "react";

const UploadForm = () => {
  return (
    <form>
      <label htmlFor="image">사진</label>
      <input id="image" type="file" />
      <button type="submit">제출</button>
    </form>
  )
}

export default UploadForm