import React, { useState } from 'react';
import fireupload from '../lib/fireupload'; 
import { db } from '../lib/firebase'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const Upload = ({ user }) => {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false); 

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!image) {
      alert('Please select an image to upload.');
      return;
    }

    try {
      setUploading(true); 

      const downloadURL = await fireupload(image); 
      setImageUrl(downloadURL);

     
      const docRef = await addDoc(collection(db, 'images'), {
        url: downloadURL,
        userId: user.uid,
        views: 0, 
        createdAt: serverTimestamp()
      });

      console.log('Image uploaded successfully with ID: ', docRef.id);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false); 
    }
  };

  const toggleForm = () => {
    setShowForm((prevShowForm) => !prevShowForm);
  };

  return (
    <div>
      {!showForm && <button className="btn btn-warning mb-3" onClick={toggleForm}>
        Dump All Your Beauty here!! 
      </button>}
      {showForm && (
        <div className="input-group mb-3">
          <input type="file" className="form-control" onChange={handleChange} />
          <button className="btn btn-primary" onClick={handleUpload} disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
          <button className="btn btn-danger" onClick={toggleForm}>Close</button>
        </div>
      )}
    </div>
  );
};

export default Upload;
