import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { auth, db } from '../lib/firebase'; 
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './display.css'

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
        createdAt: serverTimestamp()
      });

      console.log('Signup successful!');
      
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card login-container">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Signup</h2>
              {error && <div className="alert alert-danger" role="alert">{error}</div>}
              <form onSubmit={handleSignup}>
                <div className="mb-3">
                  <label htmlFor="displayName" className="form-label">Display Name</label>
                  <input type="text" className="form-control" id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="signupEmail" className="form-label">Email address</label>
                  <input type="email" className="form-control" id="signupEmail" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="signupPassword" className="form-label">Password</label>
                  <input type="password" className="form-control" id="signupPassword" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-success w-100">Signup</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
