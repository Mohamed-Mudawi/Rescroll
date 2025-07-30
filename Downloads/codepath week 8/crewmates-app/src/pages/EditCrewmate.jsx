import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../client';

function EditCrewmate() {
  const { id } = useParams();
  const [crewmate, setCrewmate] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('Crewmates').select().eq('id', id).single();
      setCrewmate(data);
    };
    fetch();
  }, [id]);

  const update = async (e) => {
    e.preventDefault();
    await supabase.from('Crewmates').update(crewmate).eq('id', id);
    window.location = '/gallery';
  };

  const deleteCrewmate = async (e) => {
    e.preventDefault();
    await supabase.from('Crewmates').delete().eq('id', id);
    window.location = '/gallery';
  };

  if (!crewmate) return <div>Loading...</div>;

  return (
    <form onSubmit={update}>
      <input value={crewmate.name} onChange={e => setCrewmate({...crewmate, name: e.target.value})} />
      <input value={crewmate.role} onChange={e => setCrewmate({...crewmate, role: e.target.value})} />
      <input value={crewmate.skill} onChange={e => setCrewmate({...crewmate, skill: e.target.value})} />
      <textarea value={crewmate.description} onChange={e => setCrewmate({...crewmate, description: e.target.value})}></textarea>
      <button type="submit">Update</button>
      <button onClick={deleteCrewmate}>Delete</button>
    </form>
  );
}

export default EditCrewmate;