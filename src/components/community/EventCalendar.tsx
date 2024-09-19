import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, push } from 'firebase/database';
import { useAuth } from '../../hooks/useAuth';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  createdBy: string;
}

export function EventCalendar() {
  const [events, setEvents] = useState<Event[]>([]);
  const [newEvent, setNewEvent] = useState({ title: '', description: '', date: '' });
  const { user } = useAuth();
  const database = getDatabase();

  useEffect(() => {
    const eventsRef = ref(database, 'events');
    const unsubscribe = onValue(eventsRef, (snapshot) => {
      const eventsData = snapshot.val();
      const eventsArray = Object.entries(eventsData || {}).map(([id, eventData]: [string, any]) => ({
        id,
        ...eventData,
      }));
      setEvents(eventsArray);
    });

    return () => {
      unsubscribe();
    };
  }, [database]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newEvent.title && newEvent.date && user) {
      const eventsRef = ref(database, 'events');
      await push(eventsRef, {
        ...newEvent,
        createdBy: user.uid,
      });
      setNewEvent({ title: '', description: '', date: '' });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Event Calendar</h2>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Event Title</span>
          </label>
          <input
            type="text"
            placeholder="Enter event title"
            className="input input-bordered w-full"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            required
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Event Description</span>
          </label>
          <textarea
            placeholder="Enter event description"
            className="textarea textarea-bordered w-full"
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
          ></textarea>
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Event Date</span>
          </label>
          <input
            type="date"
            className="input input-bordered w-full"
            value={newEvent.date}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-4">Create Event</button>
      </form>
      <div className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">{event.title}</h3>
              <p>{event.description}</p>
              <p className="text-base-content/70">Date: {event.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}