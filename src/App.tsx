import { useState, useEffect } from "react";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "./firebase";
import { v4 } from "uuid";

function App() {
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const imagesListRef = ref(storage, "images/");

  const uploadFile = () => {
    if (!imageUpload) return;
    const imageName = imageUpload.name + "-" + v4;
    const imageRef = ref(storage, `images/${imageName}`);
    uploadBytes(imageRef, imageUpload)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          setImageUrls((prev) => [...prev, url]);
        });
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
      });
  };

  useEffect(() => {
    listAll(imagesListRef)
      .then((response) => {
        const promises = response.items.map((item) => getDownloadURL(item));
        Promise.all(promises)
          .then((urls) => {
            setImageUrls((prev) => [...prev, ...urls]);
          })
          .catch((error) => {
            console.error("Error fetching image URLs:", error);
          });
      })
      .catch((error) => {
        console.error("Error listing images:", error);
      });
  }, [imagesListRef]);
  return (
    <div className="App">
      <div className="mx-auto m-5 col-6">
        <label htmlFor="formFile" className="mx-auto form-label">
          Select Images
        </label>
        <input
          className="form-control"
          type="file"
          id="formFile"
          onChange={(event) => {
            setImageUpload(event.target.files?.[0] || null);
          }}
        />
      </div>
      <div className="h-100 d-flex align-items-center justify-content-center">
        <button className="btn btn-primary" onClick={uploadFile}>
          {" "}
          Upload Image
        </button>
      </div>
      <div className="album py-5 bg-light">
        <div className="container">
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
            {imageUrls
              ? imageUrls.map((url, id) => (
                  <div className="col" key={id}>
                    <div className="card shadow-sm">
                      <img src={url} alt="image" width="100%" height="225" />
                    </div>
                  </div>
                ))
              : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
