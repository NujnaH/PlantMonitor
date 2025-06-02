import React from 'react';
import { useState } from 'react';
import './App.css';
import { JSX } from 'react/jsx-runtime';

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

function Plants({ plants }: { plants: { type: string, wateringPeriod: number }[] }) {
  const [plant, setPlant] = useState('');

  return (
  <div>
    <SearchBar value={plant} onSearch={setPlant} />
    <PlantTable plants={plants} filterText={plant}/>
  </div>)
}

function PlantTable({ plants, filterText }: { plants: { type: string, wateringPeriod: number }[], filterText: string }) {
  const rows: JSX.Element[] = []

  plants.filter(plant => plant.type.toLowerCase().includes(filterText.toLowerCase())).forEach(plant => {
    rows.push(
      <Plant plant={plant} />
    )
  })

  return (
    <table>
      <thead>
        <tr>
          <th>Type</th>
          <th>Watering period</th>
        </tr>
      </thead>
      <tbody>
        {rows}
      </tbody>
    </table>
  )
}

function Plant({ plant }: { plant: { type: string, wateringPeriod: number } }) {
  return (
    <tr>
      <td>{plant.type}</td>
      <td>{plant.wateringPeriod} days</td>
    </tr>
  )
}

const PLANTS = [
  {type: 'monstera', wateringPeriod: 7},
]

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Plant Encyclopedia</h1>
        <p>
          <Plants plants={PLANTS} />
        </p>
      </header>
    </div>
  );
};

export default App;