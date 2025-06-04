import React, { useEffect } from 'react';
import { useState } from 'react';
import './App.css';
import { JSX } from 'react/jsx-runtime';
import { Plant as PlantType } from './api/plantsApi';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { fetchPlants, addPlant, deletePlant, describePlant } from './store/plantsSlice';

interface SearchBarProps {
  value: string;
  onSearch: (value: string) => void;
}

function SearchBar({ value, onSearch }: SearchBarProps) {
  return (
    <div className="search-container">
      <input 
        type="text"
        placeholder="Search plants..."
        value={value}
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
}

function AddPlantForm({ onAdd }: { onAdd: (plant: Omit<PlantType, 'id'>) => void }) {
  const [type, setType] = useState('');
  const [wateringPeriod, setWateringPeriod] = useState('7');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      type,
      wateringPeriod: parseInt(wateringPeriod, 10)
    });
    setType('');
    setWateringPeriod('7');
  };

  return (
    <form onSubmit={handleSubmit} className="add-plant-form">
      <input
        type="text"
        placeholder="Plant type"
        value={type}
        onChange={(e) => setType(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Watering period (days)"
        value={wateringPeriod}
        onChange={(e) => setWateringPeriod(e.target.value)}
        required
        min="1"
      />
      <button type="submit">Add Plant</button>
    </form>
  );
}

function Plants() {
  const [searchText, setSearchText] = useState('');
  const dispatch = useAppDispatch();
  const { 
    items: plants, 
    loading, 
    error, 
    descriptions, 
    describingPlant 
  } = useAppSelector(state => state.plants);

  useEffect(() => {
    dispatch(fetchPlants());
  }, [dispatch]);

  const handleAddPlant = (newPlant: Omit<PlantType, 'id'>) => {
    dispatch(addPlant(newPlant));
  };

  const handleDeletePlant = (id: string) => {
    dispatch(deletePlant(id));
  };

  const handleDescribePlant = (id: string) => {
    dispatch(describePlant(id));
  };

  const filteredPlants = plants.filter(plant => 
    plant.type.toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <SearchBar value={searchText} onSearch={setSearchText} />
      <AddPlantForm onAdd={handleAddPlant} />
      <PlantTable 
        plants={filteredPlants} 
        onDelete={handleDeletePlant}
        onDescribe={handleDescribePlant}
        descriptions={descriptions}
        describingPlant={describingPlant}
      />
    </div>
  );
}

function PlantTable({ 
  plants, 
  onDelete, 
  onDescribe,
  descriptions,
  describingPlant
}: { 
  plants: PlantType[]
  onDelete: (id: string) => void
  onDescribe: (id: string) => void
  descriptions: Record<string, string>
  describingPlant: string | null
}) {
  const rows: JSX.Element[] = plants.map((plant) => (
    <Plant 
      key={plant.id} 
      plant={plant} 
      onDelete={onDelete}
      onDescribe={onDescribe}
      description={descriptions[plant.id]}
      isDescribing={describingPlant === plant.id}
    />
  ));

  return (
    <table>
      <thead>
        <tr>
          <th>Type</th>
          <th>Watering period</th>
          <th>Description</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {rows}
      </tbody>
    </table>
  );
}

function Plant({ 
  plant, 
  onDelete, 
  onDescribe,
  description,
  isDescribing
}: { 
  plant: PlantType
  onDelete: (id: string) => void
  onDescribe: (id: string) => void
  description?: string
  isDescribing: boolean
}) {
  return (
    <tr>
      <td>{plant.type}</td>
      <td>{plant.wateringPeriod} days</td>
      <td>
        {isDescribing ? (
          <span>Generating description...</span>
        ) : description ? (
          <span>{description}</span>
        ) : (
          <button onClick={() => onDescribe(plant.id)} className="describe-button">
            Get Description
          </button>
        )}
      </td>
      <td>
        <button onClick={() => onDelete(plant.id)} className="delete-button">
          Delete
        </button>
      </td>
    </tr>
  );
}

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Plant Encyclopedia</h1>
        <Plants />
      </header>
    </div>
  );
};

export default App;