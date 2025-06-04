import OpenAI from 'openai';
const client = new OpenAI();

// Define types
export interface Plant {
  id: string;
  type: string;
  wateringPeriod: number;
}

// Mock data
const MOCK_PLANTS: Plant[] = [
  { id: '1', type: 'Monstera', wateringPeriod: 7 },
  { id: '2', type: 'Snake Plant', wateringPeriod: 14 },
  { id: '3', type: 'Peace Lily', wateringPeriod: 5 },
  { id: '4', type: 'ZZ Plant', wateringPeriod: 14 },
  { id: '5', type: 'Pothos', wateringPeriod: 7 },
];

// Mock API methods
export const plantsApi = {
  getPlants: () => Promise.resolve({ data: MOCK_PLANTS }),
  addPlant: (plant: Omit<Plant, 'id'>) => {
    const newPlant = {
      ...plant,
      id: Math.random().toString(36).substr(2, 9),
    };
    MOCK_PLANTS.push(newPlant);
    return Promise.resolve({ data: newPlant });
  },
  updatePlant: (id: string, plant: Plant) => {
    const index = MOCK_PLANTS.findIndex(p => p.id === id);
    if (index !== -1) {
      MOCK_PLANTS[index] = { ...plant, id };
      return Promise.resolve({ data: MOCK_PLANTS[index] });
    }
    return Promise.reject(new Error('Plant not found'));
  },
  deletePlant: (id: string) => {
    const index = MOCK_PLANTS.findIndex(p => p.id === id);
    if (index !== -1) {
      MOCK_PLANTS.splice(index, 1);
      return Promise.resolve();
    }
    return Promise.reject(new Error('Plant not found'));
  },
  describePlant: async (id: string) => {
    const plant = MOCK_PLANTS.find(p => p.id === id);
    if (!plant) return Promise.reject(new Error('Plant not found'));
    
    // const response =await client.responses.create({
    //   model: "gpt-4.1",
    //   input: `Write a one-sentence bedtime story about ${plant.type}.`,
    // }, {
    //   maxRetries: 1,
    // });
    return 'wtf'
    // return response.output_text;
  },
}; 