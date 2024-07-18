import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Display from "./components/Display";
import { auth } from "./lib/firebase"; 
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App = () => {
  const [showLogin, setShowLogin] = useState(false); 
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showText, setShowText] = useState(false);
  const [animatedText, setAnimatedText] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setLoading(false);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!loading) {
      animateText(" Welcome to SnapShare\n ");
    }
  }, [loading]);

  const animateText = (text) => {
    let index = 0;
    const interval = setInterval(() => {
      setAnimatedText((prevText) => prevText + text[index]);
      index++;
      if (index === text.length - 1) {
        clearInterval(interval);
        setShowText(true);
      }
    }, 100);
  };

  const toggleForm = () => {
    setShowLogin((prevState) => !prevState);
  };

  return (
    <div className="container-fluid p-0 auth-background" style={{ height: "100vh" }}>
      {!loading ? (
        user ? (
          <Display user={user} />
        ) : (
          <React.Fragment>
            <div className="central-element">
              <h1><span className={`typewriter ${showText ? 'fade-in-text' : ''}`}>{animatedText}</span></h1>
              <h4>Gallery of our top 1% snapshots</h4>
              <p>Snap, Share, Repeat!</p>
            </div>
            <div className="text-center mb-4">
              <button className="btn btn-dark" onClick={toggleForm}>Start Magic</button>
            </div>
            <div className="mt-4">
              {showLogin && (
                <div className="row">
                  <div className="col-md-6">
                    <Login />
                  </div>
                  <div className="col-md-6">
                    <Signup />
                  </div>
                </div>
              )}
            </div>
          </React.Fragment>
        )
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default App;
