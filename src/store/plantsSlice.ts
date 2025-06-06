import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { plantsApi, Plant } from '../api/plantsApi'

interface PlantsState {
  items: Plant[];
  loading: boolean;
  error: string | null;
  wateringDays: Record<string, number>;
  updatingWateringPeriod: string | null;
}

const initialState: PlantsState = {
  items: [],
  loading: false,
  error: null,
  wateringDays: {},
  updatingWateringPeriod: null,
}

// Async thunks
export const fetchPlants = createAsyncThunk(
  'plants/fetchPlants',
  async () => {
    const response = await plantsApi.getPlants()
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
    addPlant: (state, action: PayloadAction<Omit<Plant, 'id'>>) => {
      const newPlant = {
        ...action.payload,
        id: Math.random().toString(36).substr(2, 9),
      }
      state.items = [...state.items, newPlant]
    },
    deletePlant: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(plant => plant.id !== action.payload)
      delete state.wateringDays[action.payload]
    },
  },
  extraReducers: (builder) => {
    builder
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

export const { addPlant, deletePlant } = plantsSlice.actions
export default plantsSlice.reducer 