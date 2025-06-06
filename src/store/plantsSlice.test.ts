import { describe, it, expect } from '@jest/globals'
import reducer, { addPlantAsync } from './plantsSlice'
import { Plant } from '../api/plantsApi'

describe('plants reducer', () => {
  const initialState = {
    items: [],
    loading: false,
    error: null,
    wateringDays: {},
    updatingWateringPeriod: null,
    addingPlant: false,
  }

  it('should handle addPlantAsync.pending', () => {
    const action = { type: addPlantAsync.pending.type }
    const nextState = reducer(initialState, action)

    expect(nextState.addingPlant).toBe(true)
    expect(nextState.error).toBeNull()
  })

  it('should handle addPlantAsync.fulfilled', () => {
    const newPlant: Plant = {
      id: '123',
      type: 'Monstera',
      wateringPeriod: 7,
    }

    const action = { 
      type: addPlantAsync.fulfilled.type, 
      payload: newPlant 
    }
    
    const nextState = reducer(initialState, action)

    expect(nextState.addingPlant).toBe(false)
    expect(nextState.items).toHaveLength(1)
    expect(nextState.items[0]).toEqual(newPlant)
  })

  it('should handle addPlantAsync.rejected', () => {
    const error = 'Failed to add plant'
    const action = { 
      type: addPlantAsync.rejected.type,
      error: { message: error }
    }
    
    const nextState = reducer(initialState, action)

    expect(nextState.addingPlant).toBe(false)
    expect(nextState.error).toBe(error)
  })
}) 