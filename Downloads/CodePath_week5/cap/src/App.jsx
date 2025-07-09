import { useState } from 'react';
import './App.css';
import APIForm from './components/APIForm';

const API_URL = 'https://api.thedogapi.com/v1/images/search?has_breeds=true';
const API_KEY = import.meta.env.VITE_APP_ACCESS_KEY;

function App() {
  const [dog, setDog] = useState(null);
  const [banList, setBanList] = useState([]);
  const [history, setHistory] = useState([]);

  const fetchDog = async () => {
    try {
      let result;
      let attempts = 0;
      do {
        const response = await fetch(API_URL, {
          headers: { 'x-api-key': API_KEY },
        });
        const data = await response.json();
        result = data[0];
        attempts++;
      } while (
        (!result || !result.breeds || result.breeds.length === 0 ||
          banList.includes(result.breeds[0]?.name) ||
          banList.includes(result.breeds[0]?.origin) ||
          banList.includes(result.breeds[0]?.temperament)) &&
        attempts < 10
      );

      if (result && result.breeds && result.breeds.length > 0) {
        setDog(result);
        setHistory([result, ...history]);
      }
    } catch (error) {
      console.error('Failed to fetch dog:', error);
    }
  };

  const banAttribute = (value) => {
    if (!banList.includes(value)) {
      setBanList([...banList, value]);
    }
  };

  const unbanAttribute = (value) => {
    setBanList(banList.filter((v) => v !== value));
  };

  return (
    <div className="App">
      <h1>Dog Discoverer</h1>
      <APIForm
        dog={dog}
        fetchDog={fetchDog}
        banList={banList}
        banAttribute={banAttribute}
        unbanAttribute={unbanAttribute}
        history={history}
      />
    </div>
  );
}

export default App;