import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true 
})

// Define types
export interface Plant {
  id: string;
  type: string;
  wateringPeriod: number;
}

// Mock data for initial state only
const DEFAULT_PLANTS: Plant[] = [
  { id: '1', type: 'Monstera', wateringPeriod: 7 },
  { id: '2', type: 'Snake Plant', wateringPeriod: 14 },
  { id: '3', type: 'Peace Lily', wateringPeriod: 5 },
  { id: '4', type: 'ZZ Plant', wateringPeriod: 14 },
  { id: '5', type: 'Pothos', wateringPeriod: 7 },
]

// Helper to get plants from localStorage
const getPersistedPlants = (): Plant[] => {
  try {
    const persistedState = localStorage.getItem('persist:root')
    if (!persistedState) {
      console.log('No persisted state found, using default plants')
      return DEFAULT_PLANTS
    }

    const parsedState = JSON.parse(persistedState)

    const parsedPlants = JSON.parse(parsedState.items)
    if (!parsedPlants || !Array.isArray(parsedPlants)) {
      console.log('Invalid plants data structure, using default plants')
      return DEFAULT_PLANTS
    }

    return parsedPlants
  } catch (error) {
    console.error('Error reading from localStorage:', error)
    console.log('Persisted state:', localStorage.getItem('persist:root'))
    return DEFAULT_PLANTS
  }
}

interface PersistedPlant {
  id: string;
  type: string;
  wateringPeriod: number;
}

// Helper to save plants to localStorage
const savePlantsToStorage = (plants: Plant[]) => {
  try {
    const persistedState = localStorage.getItem('persist:root')
    if (persistedState) {
      const parsed = JSON.parse(persistedState)
      console.log(parsed)
      const plants_state: Array<PersistedPlant> = JSON.parse(parsed.items)

      for (const plant of plants) {
        let found = false
        for (const persisted_plant of plants_state) {
          if (persisted_plant.id === plant.id) {
            found = true
            break
          }
        }
        if (!found) {
          plants_state.push(plant)
        }
      }

      parsed.items = JSON.stringify(plants_state)
      localStorage.setItem('persist:root', JSON.stringify(parsed))
      console.log('saved to localStorage')
      console.log(localStorage.getItem('persist:root'))
    }
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

// Mock API methods
export const plantsApi = {
  getPlants: async () => {
    const plants = getPersistedPlants()
    return Promise.resolve({ data: plants })
  },
  addPlant: async (plant: Omit<Plant, 'id'>) => {
    const newPlant = {
      ...plant,
      id: Math.random().toString(36).substr(2, 9),
    }
    const plants = getPersistedPlants()
    const updatedPlants = [...plants, newPlant]
    savePlantsToStorage(updatedPlants)
    return Promise.resolve({ data: newPlant })
  },
  updatePlant: async (id: string, plant: Plant) => {
    const plants = getPersistedPlants()
    const index = plants.findIndex(p => p.id === id)
    if (index !== -1) {
      const updatedPlants = [
        ...plants.slice(0, index),
        { ...plant, id },
        ...plants.slice(index + 1)
      ]
      savePlantsToStorage(updatedPlants)
      return Promise.resolve({ data: { ...plant, id } })
    }
    return Promise.reject(new Error('Plant not found'))
  },
  deletePlant: async (id: string) => {
    const plants = getPersistedPlants()
    const index = plants.findIndex(p => p.id === id)
    if (index !== -1) {
      const updatedPlants = plants.filter(p => p.id !== id)
      savePlantsToStorage(updatedPlants)
      return Promise.resolve()
    }
    return Promise.reject(new Error('Plant not found'))
  },
  describePlant: async (id: string) => {
    const plants = getPersistedPlants()
    const plant = plants.find(p => p.id === id)
    if (!plant) return Promise.reject(new Error('Plant not found'))
    
    const response = await client.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "user",
        content: `how many days should you wait before watering ${plant.type} indoors? give me just the number`
      }],
      max_tokens: 10
    })
    return response.choices[0]?.message?.content || "7"
  },
} 