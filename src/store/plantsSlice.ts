import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { plantsApi, Plant } from '../api/plantsApi'

export interface PlantsState {
  items: Plant[];
  loading: boolean;
  error: string | null;
  wateringDays: Record<string, number>;
  updatingWateringPeriod: null | string;
  addingPlant: boolean;
}

const initialState: PlantsState = {
  items: [],
  loading: false,
  error: null,
  wateringDays: {},
  updatingWateringPeriod: null,
  addingPlant: false,
}

// Async thunks
export const fetchPlants = createAsyncThunk(
  'plants/fetchPlants',
  async () => {
    const response = await plantsApi.getPlants()
    return response.data
  }
)

export const addPlantAsync = createAsyncThunk(
  'plants/addPlant',
  async (plant: Omit<Plant, 'id'>) => {
    const response = await plantsApi.addPlant(plant)
    return response.data
  }
)

export const updateWateringPeriod = createAsyncThunk(
  'plants/updateWateringPeriod',
  async (id: string) => {
    const response = await plantsApi.describePlant(id)
    return { id, days: parseInt(response, 10) || 7 }
  }
)

const plantsSlice = createSlice({
  name: 'plants',
  initialState,
  reducers: {
    deletePlant: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(plant => plant.id !== action.payload)
      delete state.wateringDays[action.payload]
    },
  },
  extraReducers: (builder) => {
    builder
      // Add plant
      .addCase(addPlantAsync.pending, (state) => {
        state.addingPlant = true
        state.error = null
      })
      .addCase(addPlantAsync.fulfilled, (state, action) => {
        state.addingPlant = false
        state.items = [...state.items, action.payload]
      })
      .addCase(addPlantAsync.rejected, (state, action) => {
        state.addingPlant = false
        state.error = action.error.message || 'Failed to add plant'
      })
      // Fetch plants
      .addCase(fetchPlants.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPlants.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchPlants.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch plants'
      })
      // Update watering period
      .addCase(updateWateringPeriod.pending, (state, action) => {
        state.updatingWateringPeriod = action.meta.arg
      })
      .addCase(updateWateringPeriod.fulfilled, (state, action) => {
        state.updatingWateringPeriod = null
        state.wateringDays[action.payload.id] = action.payload.days
        // Update the plant's watering period
        const plant = state.items.find(p => p.id === action.payload.id)
        if (plant) {
          plant.wateringPeriod = action.payload.days
        }
      })
      .addCase(updateWateringPeriod.rejected, (state, action) => {
        state.updatingWateringPeriod = null
        state.error = action.error.message || 'Failed to update watering period'
      })
  },
})

export const { deletePlant } = plantsSlice.actions
export default plantsSlice.reducer 