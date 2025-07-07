import "./App.css";
import { useState, useEffect, useRef } from "react";
import Album from "./Album";

function App() {
  const [inputs, setInputs] = useState({});
  const [albums, setAlbums] = useState([]);
  const [album, setAlbum] = useState([]);

  const fileInput = useRef(null); 

  useEffect(() => {
    getAlbums();
  }, [album]);

  async function getAlbums() {
    const response = await fetch("/albums");
    if (response.ok) {
      const data = await response.json();
      setAlbums(data);
    }
  }

  function handleChange(e) {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!inputs.artist || !inputs.title || !inputs.year || !inputs.jacket) {
      alert("Please fill in all fields and choose an image.");
      return;
    }

    const formData = new FormData();
    formData.append("artist", inputs.artist);
    formData.append("title", inputs.title);
    formData.append("year", inputs.year);
    formData.append("jacket", inputs.jacket);

    try {
      const res = await fetch("/add", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to add album");
      }

      const addedAlbum = await res.json();
      setAlbum(addedAlbum); 
      setInputs({});
      fileInput.current.value = ""; 
      alert("Album added successfully!");
    } catch (err) {
      console.error(err);
      alert("Error adding album.");
    }
  }

  return (
    <>
      <h1>My Favorites</h1>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="artist"
          onChange={handleChange}
          value={inputs.artist || ""}
          name="artist"
        />
        <input
          type="text"
          placeholder="title"
          onChange={handleChange}
          value={inputs.title || ""}
          name="title"
        />
        <input
          type="text"
          placeholder="year"
          onChange={handleChange}
          value={inputs.year || ""}
          name="year"
        />
        <input
          type="file"
          ref={fileInput}
          onChange={(e) => setInputs({ ...inputs, jacket: e.target.files[0] })}
          accept="image/*"
        />
        <button>Add</button>
      </form>

      {!!albums.length &&
        albums.map((album) => (
          <Album
            key={album._id}
            album={album}
            getAlbums={getAlbums}
            inputs={inputs}
            setInputs={setInputs}
          />
        ))}
    </>
  );
}

export default App;
