import { useState, useEffect } from "react";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  list,
} from "firebase/storage";
import { storage } from "./firebase";
import { v4 } from "uuid";

function App() {
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);

  const imagesListRef = ref(storage, "images/");
  const uploadFile = () => {
    if (imageUpload == null) return;
    const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImageUrls((prev) => [...prev, url]);
      });
    });
  };
  useEffect(() => {
    listAll(imagesListRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setImageUrls((prev) => [...prev, url]);
        });
      });
    });
  }, []);
  return (
    <div className="App">
      <div class="mx-auto m-5 col-6">
  <label for="formFile" class="mx-auto form-label">Select Images</label>
  <input class="form-control" type="file" id="formFile" onChange={(event) => {
          setImageUpload(event.target.files[0]);
        }}/>
</div>
      <div class="h-100 d-flex align-items-center justify-content-center">
      <button class='btn btn-primary' onClick={uploadFile}> Upload Image</button>
      </div>
      <div class="album py-5 bg-light">
    <div class="container">
      <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
        {imageUrls ? imageUrls.map((url) => (
        <div class="col">
        <div class="card shadow-sm">
          <img src={url} alt="image" width="100%" height="225" />
        </div>
      </div>
      )) : null}
      </div>
    </div>
  </div>
    </div>
  );
}

export default App;
