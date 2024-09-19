import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onChildAdded, push } from 'firebase/database';
import { useAuth } from '../../hooks/useAuth';

interface Post {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: number;
  likes: number;
}

export function CommunityFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const { user } = useAuth();
  const database = getDatabase();

  useEffect(() => {
    const postsRef = ref(database, 'communityFeed');
    const unsubscribe = onChildAdded(postsRef, (snapshot) => {
      const post = snapshot.val();
      setPosts((prevPosts) => [...prevPosts, { id: snapshot.key!, ...post }]);
    });

    return () => {
      unsubscribe();
    };
  }, [database]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPost.trim() && user) {
      const postsRef = ref(database, 'communityFeed');
      await push(postsRef, {
        userId: user.uid,
        userName: user.displayName || user.email,
        content: newPost,
        timestamp: Date.now(),
        likes: 0,
      });
      setNewPost('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Community Feed</h2>
      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          className="textarea textarea-bordered w-full"
          placeholder="What's on your mind?"
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        ></textarea>
        <button type="submit" className="btn btn-primary mt-2">Post</button>
      </form>
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">{post.userName}</h3>
              <p>{post.content}</p>
              <div className="card-actions justify-between items-center">
                <span className="text-sm text-base-content/70">
                  {new Date(post.timestamp).toLocaleString()}
                </span>
                <button className="btn btn-ghost btn-sm">
                  👍 {post.likes}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}