import React, { useEffect, useState, useRef } from 'react';
import { auth } from '../lib/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import Upload from './Upload';
import 'bootstrap/dist/css/bootstrap.min.css';
import './display.css';
import RandomImage from './RandomImage';
import Navbar from './Navbar';

const Display = ({ user }) => {
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enlargedImg, setEnlargedImg] = useState(null);
  const [enlargedImgData, setEnlargedImgData] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'images'), where('userId', '==', user.uid)),
      (querySnapshot) => {
        const updatedImages = [];
        querySnapshot.forEach((doc) => {
          updatedImages.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setImages(updatedImages);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching images:', error);
        setError('Failed to fetch images. Please try again later.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user.uid]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const openEnlargedView = (url, id) => {
    try {
      const imageData = images.find((img) => img.id === id);
      if (!imageData) {
        throw new Error('Image data not found');
      }

      setEnlargedImg(url);
      setEnlargedImgData({ ...imageData, id });
      setDeleteModalOpen(true);
      adjustModalSize();
    } catch (error) {
      console.error('Error opening enlarged view:', error);
    }
  };

  const closeEnlargedView = () => {
    setEnlargedImg(null);
    setEnlargedImgData(null);
    setDeleteModalOpen(false);
  };

  const adjustModalSize = () => {
    if (enlargedImg && modalRef.current) {
      const img = new Image();
      img.src = enlargedImg;
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        const modalContent = modalRef.current.querySelector('.modal-content');
        if (modalContent) {
          modalContent.style.maxWidth = `${Math.min(90, aspectRatio * 90)}vw`;
          modalContent.style.maxHeight = `${Math.min(90 / aspectRatio, 90)}vh`;
        }
      };
    }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      await deleteDoc(doc(db, 'images', imageId));
      console.log('Image deleted successfully');
      setEnlargedImg(null);
      setDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const copyImageLink = async () => {
    if (enlargedImg && enlargedImgData) {
      try {
        await navigator.clipboard.writeText(enlargedImg);
        console.log('Image link copied to clipboard');

        const docRef = doc(db, 'images', enlargedImgData.id);
        await updateDoc(docRef, {
          views: enlargedImgData.views + 1
        });
        setEnlargedImgData(prevData => ({ ...prevData, views: prevData.views + 1 }));
        
      } catch (err) {
        console.error('Error copying image link:', err);
      }
    }
  };

  return (
    <div className="viewport-container bg-white">
      <div className="container">
        <Navbar/>
        <div className="text-center mb-4">
          <RandomImage />
          <Upload user={user} />
          <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
        </div>
        <div className="row row-cols-1 row-cols-md-3 g-4 pb-4">
          {loading && <p>Loading images...</p>}
          {error && <p className="text-danger">{error}</p>}
          {!loading && images.length > 0 ? (
            images.map((image) => (
              <div key={image.id} className="col">
                <div className="ratio ratio-1x1">
                  <img
                    src={image.url}
                    className="card-img-top"
                    alt="Uploaded"
                    onClick={() => openEnlargedView(image.url, image.id)}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
              </div>
            ))
          ) : (
            !loading && <p>No images uploaded yet.</p>
          )}
        </div>

        {enlargedImg && enlargedImgData && (
        <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: "rgba(0, 0, 0, 0.965)" }} onClick={closeEnlargedView}>
          <div className="modal-dialog modal-dialog-centered" ref={modalRef}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>       
              <div className="modal-body">
                <button type="button" className="btn-close mr-5" aria-label="Close" onClick={closeEnlargedView}></button>
                <button type="button" className="btn btn-secondary mb-2" onClick={copyImageLink}>Copy Link</button>
                <img src={enlargedImg} className="img-fluid d-block mx-auto" alt="Enlarged" />
              </div>
            <div className="d-flex justify-content-center">
              <p>Views: {enlargedImgData.views + 1}</p>
            </div>
        <button type="button" className="btn btn-danger" onClick={() => handleDeleteImage(enlargedImgData.id)}>Delete</button>
          </div>
        </div>
      </div>
)}


        <div className="yellow-bottom-div"></div> {/* Yellow bottom div */}
        
      </div>
    </div>
  );
};

export default Display;
