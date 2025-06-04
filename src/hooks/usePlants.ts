import { useState, useEffect } from 'react'
import { Plant, plantsApi } from '../api/plantsApi'

interface UsePlantsState {
  plants: Plant[];
  loading: boolean;
  error: Error | null;
}

export const usePlants = () => {
  const [state, setState] = useState<UsePlantsState>({
    plants: [],
    loading: false,
    error: null,
  })

  const fetchPlants = async () => {
    setState(prev => ({ ...prev, loading: true }))
    try {
      const response = await plantsApi.getPlants()
      setState({
        plants: response.data,
        loading: false,
        error: null,
      })
    } catch (error) {
      setState({
        plants: [],
        loading: false,
        error: error as Error,
      })
    }
  }

  const addPlant = async (plant: Plant) => {
    setState(prev => ({ ...prev, loading: true }))
    try {
      await plantsApi.addPlant(plant)
      fetchPlants() // Refresh the list
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error as Error,
      }))
    }
  }

  useEffect(() => {
    fetchPlants()
  }, [])

  return {
    ...state,
    addPlant,
    refreshPlants: fetchPlants,
  }
} 