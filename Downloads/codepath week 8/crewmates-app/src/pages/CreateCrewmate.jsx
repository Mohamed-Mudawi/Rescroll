import { useState } from 'react';
import { supabase } from '../client';
import { Link } from 'react-router-dom';

export default function CreateCrewmate() {
  const [crewmate, setCrewmate] = useState({
    name: '',
    role: '',
    skill: '',
    description: '',
  });

  const create = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('crewmates')
      .insert(crewmate)
      .select();

    if (error) {
      console.error('Insert failed:', error);
      alert('Could not create crewmate—check console');
      return;
    }

    console.log('Inserted:', data);
    window.location = '/gallery';
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Create Crewmate</h1>
      <form onSubmit={create}>
        <input
          placeholder="Name"
          value={crewmate.name}
          onChange={(e) => setCrewmate({ ...crewmate, name: e.target.value })}
        />
        <input
          placeholder="Role"
          value={crewmate.role}
          onChange={(e) => setCrewmate({ ...crewmate, role: e.target.value })}
        />
        <input
          placeholder="Skill"
          value={crewmate.skill}
          onChange={(e) => setCrewmate({ ...crewmate, skill: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={crewmate.description}
          onChange={(e) =>
            setCrewmate({ ...crewmate, description: e.target.value })
          }
        />
        <button type="submit">Create Crewmate</button>
      </form>

      <p>
        <Link to="/gallery">Go to Crew Gallery</Link>
      </p>
    </div>
  );
}