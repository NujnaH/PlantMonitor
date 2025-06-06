import React, { useEffect } from 'react'
import { useState } from 'react'
import './App.css'
import { JSX } from 'react/jsx-runtime'
import { Plant as PlantType } from './api/plantsApi'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { fetchPlants, addPlantAsync, deletePlant, updateWateringPeriod } from './store/plantsSlice'

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
  )
}

function AddPlantForm({ onAdd }: { onAdd: (plant: Omit<PlantType, 'id'>) => void }) {
  const [type, setType] = useState('')
  const [wateringPeriod, setWateringPeriod] = useState('7')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd({
      type,
      wateringPeriod: parseInt(wateringPeriod, 10)
    })
    setType('')
    setWateringPeriod('7')
  }

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
  )
}

function Plants() {
  const [searchText, setSearchText] = useState('')
  const dispatch = useAppDispatch()
  const { 
    items: plants, 
    loading, 
    error, 
    wateringDays, 
    updatingWateringPeriod,
    addingPlant 
  } = useAppSelector(state => state.plants)

  useEffect(() => {
    dispatch(fetchPlants())
  }, [dispatch])

  const handleAddPlant = (newPlant: Omit<PlantType, 'id'>) => {
    dispatch(addPlantAsync(newPlant))
  }

  const handleDeletePlant = (id: string) => {
    dispatch(deletePlant(id))
  }

  const handleUpdateWateringPeriod = (id: string) => {
    dispatch(updateWateringPeriod(id))
  }

  const filteredPlants = plants.filter(plant => 
    plant.type.toLowerCase().includes(searchText.toLowerCase())
  )

  if (loading || addingPlant) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <SearchBar value={searchText} onSearch={setSearchText} />
      <AddPlantForm onAdd={handleAddPlant} />
      <PlantTable 
        plants={filteredPlants} 
        onDelete={handleDeletePlant}
        onUpdateWatering={handleUpdateWateringPeriod}
        wateringDays={wateringDays}
        updatingWateringPeriod={updatingWateringPeriod}
      />
    </div>
  )
}

function PlantTable({ 
  plants, 
  onDelete, 
  onUpdateWatering,
  wateringDays,
  updatingWateringPeriod
}: { 
  plants: PlantType[]
  onDelete: (id: string) => void
  onUpdateWatering: (id: string) => void
  wateringDays: Record<string, number>
  updatingWateringPeriod: string | null
}) {
  const rows: JSX.Element[] = plants.map((plant) => (
    <Plant 
      key={plant.id} 
      plant={plant} 
      onDelete={onDelete}
      onUpdateWatering={onUpdateWatering}
      suggestedWateringDays={wateringDays[plant.id]}
      isUpdating={updatingWateringPeriod === plant.id}
    />
  ))

  return (
    <table>
      <thead>
        <tr>
          <th>Type</th>
          <th>Current Watering Period</th>
          <th>Suggested Watering Period</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {rows}
      </tbody>
    </table>
  )
}

function Plant({ 
  plant, 
  onDelete, 
  onUpdateWatering,
  suggestedWateringDays,
  isUpdating
}: { 
  plant: PlantType
  onDelete: (id: string) => void
  onUpdateWatering: (id: string) => void
  suggestedWateringDays?: number
  isUpdating: boolean
}) {
  return (
    <tr>
      <td>{plant.type}</td>
      <td>{plant.wateringPeriod} days</td>
      <td>
        {isUpdating ? (
          <span>Updating...</span>
        ) : suggestedWateringDays ? (
          <span>{suggestedWateringDays} days</span>
        ) : (
          <button onClick={() => onUpdateWatering(plant.id)} className="update-button">
            Get Suggestion
          </button>
        )}
      </td>
      <td>
        <button onClick={() => onDelete(plant.id)} className="delete-button">
          Delete
        </button>
      </td>
    </tr>
  )
}

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Plant Encyclopedia</h1>
        <Plants />
      </header>
    </div>
  )
}

export default App