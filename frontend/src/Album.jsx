import { useState } from "react";

const Album = ({ album, getAlbums, inputs, setInputs }) => {
  const [isEditing, setIsEditing] = useState(false);

  async function handleUpdate() {
    if (!inputs.jacket) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("jacket", inputs.jacket);

    try {
      const res = await fetch(`/update/${album._id}`, {
        method: "PATCH",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to update album.");
      }

      const updatedAlbum = await res.json();
      alert("Album updated successfully!");
      getAlbums(); 
      setIsEditing(false); 
    } catch (err) {
      console.error(err);
      alert("Error updating album.");
    }
  }

  async function handleDelete() {
    const confirmDelete = window.confirm("Are you sure you want to delete this album?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/delete/${album._id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete album.");
      }

      alert("Album deleted successfully.");
      getAlbums(); 
    } catch (err) {
      console.error(err);
      alert("Error deleting album.");
    }
  }

  return (
    <div className="card">
      {!isEditing && (
        <div className="img-container">
          <img
            width="100"
            height="100"
            src={`/uploads/${album.jacket}`} 
            alt="album jacket"
          />
          <button onClick={() => setIsEditing(true)}>Change image</button>
        </div>
      )}

      {isEditing && (
        <div className="update">
          <input
            type="file"
            onChange={(e) =>
              setInputs({ ...inputs, jacket: e.target.files[0] })
            }
            accept="image/*"
          />
          <div className="update-btn">
            <button onClick={handleUpdate}>Update</button>
            <button onClick={() => setIsEditing(false)}>Back</button>
          </div>
        </div>
      )}

      <p>Artist: {album.artist}</p>
      <p>Title: {album.title}</p>
      <p>{album.year}</p>

      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default Album;
