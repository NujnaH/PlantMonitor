import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { plantsApi, Plant } from '../api/plantsApi'

interface PlantsState {
  items: Plant[];
  loading: boolean;
  error: string | null;
  descriptions: Record<string, string>;
  describingPlant: string | null;
}

const initialState: PlantsState = {
  items: [],
  loading: false,
  error: null,
  descriptions: {},
  describingPlant: null,
}

// Async thunks
export const fetchPlants = createAsyncThunk(
  'plants/fetchPlants',
  async () => {
    const response = await plantsApi.getPlants()
    return response.data
  }
)

export const describePlant = createAsyncThunk(
  'plants/describePlant',
  async (id: string) => {
    const response = await plantsApi.describePlant(id)
    return { id, description: response }
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
      delete state.descriptions[action.payload]
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
      // Describe plant
      .addCase(describePlant.pending, (state, action) => {
        state.describingPlant = action.meta.arg
      })
      .addCase(describePlant.fulfilled, (state, action) => {
        state.describingPlant = null
        state.descriptions[action.payload.id] = action.payload.description
      })
      .addCase(describePlant.rejected, (state, action) => {
        state.describingPlant = null
        state.error = action.error.message || 'Failed to get plant description'
      })
  },
})

export const { addPlant, deletePlant } = plantsSlice.actions
export default plantsSlice.reducer 