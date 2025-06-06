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

// Mock data
let mockPlants: Plant[] = [
  { id: '1', type: 'Monstera', wateringPeriod: 7 },
  { id: '2', type: 'Snake Plant', wateringPeriod: 14 },
  { id: '3', type: 'Peace Lily', wateringPeriod: 5 },
  { id: '4', type: 'ZZ Plant', wateringPeriod: 14 },
  { id: '5', type: 'Pothos', wateringPeriod: 7 },
]

// Mock API methods
export const plantsApi = {
  getPlants: async () => Promise.resolve({ data: [...mockPlants] }),
  addPlant: async (plant: Omit<Plant, 'id'>) => {
    const newPlant = {
      ...plant,
      id: Math.random().toString(36).substr(2, 9),
    }
    mockPlants = [...mockPlants, newPlant]
    return Promise.resolve({ data: newPlant })
  },
  updatePlant: async (id: string, plant: Plant) => {
    const index = mockPlants.findIndex(p => p.id === id)
    if (index !== -1) {
      mockPlants = [
        ...mockPlants.slice(0, index),
        { ...plant, id },
        ...mockPlants.slice(index + 1)
      ]
      return Promise.resolve({ data: mockPlants[index] })
    }
    return Promise.reject(new Error('Plant not found'))
  },
  deletePlant: async (id: string) => {
    const index = mockPlants.findIndex(p => p.id === id)
    if (index !== -1) {
      mockPlants = mockPlants.filter(p => p.id !== id)
      return Promise.resolve()
    }
    return Promise.reject(new Error('Plant not found'))
  },
  describePlant: async (id: string) => {
    const plant = mockPlants.find(p => p.id === id)
    if (!plant) return Promise.reject(new Error('Plant not found'))
    
    const response = await client.responses.create({
      model: "gpt-4.1",
      input: `how many days should you wait before watering ${plant.type} indoors? give me just the number`
    }, {
      maxRetries: 1,
    })
    return response.output_text
  },
} 