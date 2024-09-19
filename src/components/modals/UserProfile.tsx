import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getDatabase, ref, set, get } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';

interface UserProfileProps {
  onClose: () => void;
}

export function UserProfile({ onClose }: UserProfileProps) {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [bio, setBio] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.photoURL || '');

  useEffect(() => {
    if (user) {
      const database = getDatabase();
      const userRef = ref(database, `users/${user.uid}`);
      get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setBio(userData.bio || '');
        }
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      const database = getDatabase();
      const userRef = ref(database, `users/${user.uid}`);
      
      let photoURL = user.photoURL;
      if (avatarFile) {
        const storage = getStorage();
        const avatarRef = storageRef(storage, `avatars/${user.uid}`);
        await uploadBytes(avatarRef, avatarFile);
        photoURL = await getDownloadURL(avatarRef);
      }

      await set(userRef, {
        displayName,
        bio,
        photoURL,
      });

      await updateProfile(user, { displayName, photoURL });

      onClose();
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
      setAvatarPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-base-100 p-6 rounded-lg shadow-xl w-96 max-w-full">
        <h3 className="text-lg font-bold mb-4">Edit Profile</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Display Name</span>
            </label>
            <input
              type="text"
              placeholder="Display Name"
              className="input input-bordered w-full"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Bio</span>
            </label>
            <textarea
              placeholder="Tell us about yourself"
              className="textarea textarea-bordered w-full"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            ></textarea>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Avatar</span>
            </label>
            <div className="flex items-center space-x-4">
              <div className="avatar">
                <div className="w-24 rounded-full">
                  <img src={avatarPreview || `https://api.dicebear.com/6.x/initials/svg?seed=${displayName}`} alt="Avatar Preview" />
                </div>
              </div>
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="file-input file-input-bordered w-full max-w-xs" />
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-2">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}