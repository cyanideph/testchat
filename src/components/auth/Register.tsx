import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../services/firebase';

export function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });
    } catch (err) {
      setError('Failed to create an account');
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Register for UZZAP-BETA</h2>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Display Name</span>
            </label>
            <input
              type="text"
              placeholder="Display Name"
              className="input input-bordered"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="Email"
              className="input input-bordered"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="Password"
              className="input input-bordered"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-control mt-6">
            <button type="submit" className="btn btn-primary">Register</button>
          </div>
        </form>
      </div>
    </div>
  );
}