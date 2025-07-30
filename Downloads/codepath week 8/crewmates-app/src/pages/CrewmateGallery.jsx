import { useEffect, useState } from 'react';
import { supabase } from '../client';
import { Link } from 'react-router-dom';

export default function CrewmateGallery() {
  const [crew, setCrew] = useState([]);

  useEffect(() => {
    const fetchCrew = async () => {
      const { data, error } = await supabase
        .from('crewmates')          // lowercase table name
        .select()
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Fetch failed:', error);
        return;
      }
      setCrew(data);
    };
    fetchCrew();
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Crewmate Gallery</h1>
      <p>
        <Link to="/">+ Create New Crewmate</Link>
      </p>

      {crew.length === 0 ? (
        <p>No crewmates yet. Add one above!</p>
      ) : (
        crew.map((c) => (
          <div
            key={c.id}
            style={{
              border: '1px solid #444',
              padding: '0.5rem',
              marginBottom: '0.5rem',
            }}
          >
            <Link to={`/crewmates/${c.id}`}>
              <strong>{c.name}</strong> ({c.role})
            </Link>
            <p>{c.skill}</p>
            <p>
              <Link to={`/crewmates/${c.id}/edit`}>✏️ Edit</Link>
            </p>
          </div>
        ))
      )}
    </div>
  );
}