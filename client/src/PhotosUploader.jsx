import axios from "axios";
import { useState } from "react";
import Image from "./Image.jsx";

export default function PhotosUploader({ addedPhotos, onChange }) {
  const [photoLink, setPhotoLink] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  async function addPhotoByLink(ev) {
    ev.preventDefault();
    setIsUploading(true);
    setUploadError('');
    try {
      const { data: filename } = await axios.post('/api/upload/upload-by-link', { link: photoLink });
      onChange(prev => [...prev, filename]);
      setPhotoLink('');
    } catch (e) {
      setUploadError(e.response?.data?.error || 'Failed to upload photo');
    } finally {
      setIsUploading(false);
    }
  }

  async function uploadPhoto(ev) {
    const files = ev.target.files;
    setIsUploading(true);
    setUploadError('');
    const data = new FormData();
    for (let file of files) {
      data.append('photos', file);
    }
    try {
      const { data: filenames } = await axios.post('/api/upload/upload', data, {
        headers: { 'Content-type': 'multipart/form-data' },
      });
      onChange(prev => [...prev, ...filenames]);
    } catch (e) {
      setUploadError(e.response?.data?.error || 'Failed to upload photos');
    } finally {
      setIsUploading(false);
    }
  }

  function removePhoto(ev, filename) {
    ev.preventDefault();
    onChange(addedPhotos.filter(photo => photo !== filename));
  }

  function selectAsMainPhoto(ev, filename) {
    ev.preventDefault();
    onChange([filename, ...addedPhotos.filter(photo => photo !== filename)]);
  }

  return (
    <div className="space-y-4">
      {/* Photo by link */}
      <div className="flex gap-2 mb-3">
        <input
          value={photoLink}
          onChange={ev => setPhotoLink(ev.target.value)}
          type="text"
          placeholder="Add using a link (e.g., .jpg)"
          className="input-style flex-grow"
          disabled={isUploading}
        />
        <button
          onClick={addPhotoByLink}
          className="bg-gradient-secondary-btn text-white px-4 rounded-2xl hover:scale-105 transition-transform duration-300 shadow-neon-glow-cyan disabled:opacity-50"
          disabled={isUploading || !photoLink}
        >
          {isUploading ? 'Teleporting...' : 'Add Photo Link'}
        </button>
      </div>

      {/* Upload error */}
      {uploadError && (
        <div className="error-message">{uploadError}</div>
      )}

      {/* Uploaded preview grid */}
      <div className="mt-2 grid gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {addedPhotos.map(link => (
          <div
            key={link}
            className="h-32 flex relative rounded-2xl overflow-hidden shadow-glass-shadow border border-holo-border"
          >
            <Image className="rounded-2xl w-full h-full object-cover" src={link} alt="" />
            <button
              onClick={ev => removePhoto(ev, link)}
              className="cursor-pointer absolute bottom-1 right-1 text-white bg-plasma-pink bg-opacity-70 rounded-2xl py-2 px-3 hover:bg-opacity-90 transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9M6.75 19.5a4.5 4.5 0 01-1.41-8.775
                    5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752
                    3.752 0 0118 19.5H6.75z" />
              </svg>
            </button>
          </div>
        ))}

        {/* Upload from device */}
        <label className="image-upload h-32 flex flex-col items-center justify-center cursor-pointer">
          <input
            type="file"
            multiple
            className="hidden"
            onChange={uploadPhoto}
            disabled={isUploading}
          />
          {isUploading ? (
            <div className="loading-spinner !w-6 !h-6"></div>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-neon-green">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75
                    19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0
                    0110.233-2.33 3 3 0 013.758 3.848A3.752
                    3.752 0 0118 19.5H6.75z" />
              </svg>
              <span className="text-lg text-neon-cyan font-semibold mt-1"
                style={{ textShadow: '0 1px 8px #000, 0 0 2px #00f5ff' }}>
                Upload
              </span>
            </>
          )}
        </label>
      </div>
    </div>
  );
}
