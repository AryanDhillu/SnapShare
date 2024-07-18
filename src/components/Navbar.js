import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './display.css'

const Navbar = () => {
    const quotes = [
        "Greetings from SnapShare!",
        "Welcome to the SnapShare family!",
        "Explore the world with SnapShare!",
        "Join our SnapShare community today!",
        "Capture and share with SnapShare!",
        "Hi there, welcome to SnapShare!",
        "SnapShare says hello!",
        "Welcome aboard SnapShare!"
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % quotes.length);
        }, 4000); 

        return () => clearInterval(intervalId);
    }, [quotes.length]);

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="navbar-brand mx-auto">
                {quotes[currentIndex]}
            </div>
        </nav>
    );
};

export default Navbar;
