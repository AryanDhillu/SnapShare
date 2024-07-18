import React, { useEffect, useState } from 'react';
import './display.css'

const RandomImage = () => {
  const [image, setImage] = useState(null);
  const [views, setViews] = useState(0);

  const UNSPLASH_ACCESS_KEY = 'yOUR_UNSPLASH_API_KEY';

  useEffect(() => {
    const fetchRandomImage = async () => {
      try {
        const response = await fetch(`https://api.unsplash.com/photos/random?query=people&client_id=${UNSPLASH_ACCESS_KEY}`);
        const data = await response.json();
        setImage(data);
        setViews(Math.floor(Math.random() * 1000) + 1);
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    };

    fetchRandomImage();
  }, []);

  return (
    <div className="random-image-container text-center mb-4">
        <h2 className="text-white">Today's Top Pic</h2>
      {image ? (
        <div>
          <img src={image.urls.regular} alt={image.alt_description} className="restricted-img" />
          <p>Views: {views}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      <p className="text-secondary">Share your snaps and claim the top spot!!</p>
    </div>
  );
};

export default RandomImage;
