import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import PhotosUploader from "../../PhotosUploader";
import Amenities from "../../components/Amenities";

export default function PlacesFormPage() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [photos, setPhotos] = useState([]);
  const [description, setDescription] = useState("");
  const [amenities, setAmenities] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [leaseTerm, setLeaseTerm] = useState("monthly");
  const [price, setPrice] = useState("");
  const [roomType, setRoomType] = useState("");
  const [occupancy, setOccupancy] = useState("");
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!id) return;
    axios.get("/api/places/" + id).then((res) => {
      const data = res.data;
      setTitle(data.title);
      setAddress(data.address);
      setPhotos(data.photos);
      setDescription(data.description);
      setAmenities(data.amenities);
      setExtraInfo(data.extraInfo);
      setLeaseTerm(data.leaseTerm);
      setPrice(data.price);
      setRoomType(data.roomType);
      setOccupancy(data.occupancy);
    });
  }, [id]);

  const savePlace = async (e) => {
    e.preventDefault();
    const placeData = {
      title,
      address,
      photos,
      description,
      amenities,
      extraInfo,
      leaseTerm,
      price,
      roomType,
      occupancy,
    };

    if (id) {
      await axios.put("/api/places", { id, ...placeData });
    } else {
      await axios.post("/api/places", placeData);
    }
    setRedirect(true);
  };

  if (redirect) return <Navigate to="/account/places" />;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 text-white">
      <form onSubmit={savePlace} className="space-y-6">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-style w-full"
        />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="input-style w-full"
        />
        <PhotosUploader photos={photos} onChange={setPhotos} />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input-style w-full h-24"
        />
        <Amenities selected={amenities} onChange={setAmenities} />
        <textarea
          placeholder="Extra Info"
          value={extraInfo}
          onChange={(e) => setExtraInfo(e.target.value)}
          className="input-style w-full h-20"
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <select
            value={leaseTerm}
            onChange={(e) => setLeaseTerm(e.target.value)}
            className="input-style select-dark"
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="input-style"
          />
          <select
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            className="input-style select-dark"
          >
            <option value="">Room Type</option>
            <option value="single">Single</option>
            <option value="double">Double</option>
            <option value="sharing">Sharing</option>
          </select>
          <select
            value={occupancy}
            onChange={(e) => setOccupancy(e.target.value)}
            className="input-style select-dark"
          >
            <option value="">Occupancy</option>
            <option value="boys">Boys</option>
            <option value="girls">Girls</option>
            <option value="co-ed">Co-ed</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-neon-green text-black px-6 py-2 rounded-lg font-semibold hover:bg-green-400 transition"
        >
          Save
        </button>
      </form>
    </div>
  );
}
