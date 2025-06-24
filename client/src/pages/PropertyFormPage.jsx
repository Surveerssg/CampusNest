import {useEffect, useState} from "react";
import PhotosUploader from "../PhotosUploader";
import Perks from "../Perks";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";

export default function PropertyFormPage() {
  const {id} = useParams();
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [description, setDescription] = useState('');
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('pg');
  const [occupancy, setOccupancy] = useState('boys');
  const [roomType, setRoomType] = useState('sharing');
  const [leaseTerm, setLeaseTerm] = useState('monthly');
  const [maxGuests, setMaxGuests] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get('/api/places/'+id).then(response => {
       const {data} = response;
       setTitle(data.title);
       setAddress(data.address);
       setAddedPhotos(data.photos);
       setDescription(data.description);
       setPerks(data.perks);
       setExtraInfo(data.extraInfo);
       setPrice(data.price);
       setType(data.type);
       setOccupancy(data.occupancy);
       setRoomType(data.roomType);
       setLeaseTerm(data.leaseTerm);
       setMaxGuests(data.maxGuests);
    });
  }, [id]);

  function inputHeader(text) {
    return (
      <h2 className="text-2xl mt-4 text-white">{text}</h2>
    );
  }
  function inputDescription(text) {
    return (
      <p className="text-gray-500 text-sm">{text}</p>
    );
  }
  function preInput(header, description) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  }

  async function savePlace(ev) {
    ev.preventDefault();
  
    const parsedPrice = parseInt(price);
    const parsedMaxGuests = parseInt(maxGuests);
  
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      alert("Please enter a valid price.");
      return;
    }
  
    if (isNaN(parsedMaxGuests) || parsedMaxGuests <= 0) {
      alert("Please enter a valid number of max guests.");
      return;
    }
  
    const placeData = {
      title,
      address,
      photos: addedPhotos,
      description,
      perks,
      extraInfo,
      price: parsedPrice,
      type,
      occupancy,
      roomType,
      leaseTerm,
      maxGuests: parsedMaxGuests,
    };
  
    try {
      if (id) {
        await axios.put('/api/places', { id, ...placeData });
      } else {
        await axios.post('/api/places', placeData);
      }
      navigate('/account/properties');
    } catch (error) {
      console.error("Error saving place:", error);
      alert("Something went wrong while saving. Please check your inputs.");
    }
  }  

  return (
    <div>
      <form onSubmit={savePlace}>
        {preInput('Title', 'Title for your place. should be short and catchy')}
        <input type="text" value={title} onChange={ev => setTitle(ev.target.value)} placeholder="title, for example: My lovely apt" className="w-full px-4 py-2 border border-gray-600 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        {preInput('Address', 'Address to this place')}
        <input type="text" value={address} onChange={ev => setAddress(ev.target.value)}placeholder="address" className="w-full px-4 py-2 border border-gray-600 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        {preInput('Photos','more = better')}
        <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />
        {preInput('Description','description of the place')}
        <textarea value={description} onChange={ev => setDescription(ev.target.value)} className="w-full h-32 px-4 py-2 border border-gray-600 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        {preInput('Perks','select all the perks of your place')}
        <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <Perks selected={perks} onChange={setPerks} />
        </div>
        {preInput('Extra info','house rules, etc')}
        <textarea value={extraInfo} onChange={ev => setExtraInfo(ev.target.value)} className="w-full h-32 px-4 py-2 border border-gray-600 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4 my-4">
          <div>
            <h3 className="mb-2 text-white">Property Type</h3>
            <select value={type} onChange={ev => setType(ev.target.value)} className="w-full px-4 py-3 border border-gray-600 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="pg">PG</option>
              <option value="hostel">Hostel</option>
              <option value="flat">Flat</option>
            </select>
          </div>
          <div>
            <h3 className="mb-2 text-white">Occupancy</h3>
            <select value={occupancy} onChange={ev => setOccupancy(ev.target.value)} className="w-full px-4 py-3 border border-gray-600 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="boys">Boys</option>
              <option value="girls">Girls</option>
              <option value="co-ed">Co-ed</option>
            </select>
          </div>
          <div>
            <h3 className="mb-2 text-white">Room Type</h3>
            <select value={roomType} onChange={ev => setRoomType(ev.target.value)} className="w-full px-4 py-3 border border-gray-600 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="sharing">Sharing</option>
              <option value="single">Single</option>
              <option value="double">Double</option>
            </select>
          </div>
          <div>
            <h3 className="mb-2 text-white">Lease Term</h3>
            <select value={leaseTerm} onChange={ev => setLeaseTerm(ev.target.value)} className="w-full px-4 py-3 border border-gray-600 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div>
            <h3 className="mt-2 -mb-1 text-white">Price per {leaseTerm.slice(0, -2)}</h3>
            <input type="number" value={price} onChange={ev => setPrice(Number(ev.target.value))} placeholder="10000" className="w-full px-4 py-2 border border-gray-600 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <button className="w-full py-3 mt-6 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all duration-300">Save</button>
      </form>
    </div>
  );
} 