import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../client';

function CrewmateDetail() {
  const { id } = useParams();
  const [crewmate, setCrewmate] = useState(null);

  useEffect(() => {
    const fetchOne = async () => {
      const { data } = await supabase
        .from('Crewmates')
        .select()
        .eq('id', id)
        .single();
      setCrewmate(data);
    };
    fetchOne();
  }, [id]);

  if (!crewmate) return <div>Loading...</div>;

  return (
    <div>
      <h1>{crewmate.name}</h1>
      <p><strong>Role:</strong> {crewmate.role}</p>
      <p><strong>Skill:</strong> {crewmate.skill}</p>
      <p>{crewmate.description}</p>
      <Link to={`/edit/${crewmate.id}`}>Edit Crewmate</Link>
    </div>
  );
}

export default CrewmateDetail;