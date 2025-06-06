import { describe, it, expect } from '@jest/globals'
import reducer, { addPlant } from './plantsSlice'
import { Plant } from '../api/plantsApi'

describe('plants reducer', () => {
  const initialState = {
    items: [],
    loading: false,
    error: null,
    wateringDays: {},
    updatingWateringPeriod: null,
  }

  it('should handle adding a new plant', () => {
    const newPlant: Omit<Plant, 'id'> = {
      type: 'Monstera',
      wateringPeriod: 7,
    }

    const nextState = reducer(initialState, addPlant(newPlant))

    // Check that a new plant was added
    expect(nextState.items).toHaveLength(1)
    
    // Verify the plant properties
    const addedPlant = nextState.items[0]
    expect(addedPlant).toEqual({
      ...newPlant,
      id: expect.any(String), // Since ID is randomly generated
    })

    // Verify the ID format (should be a 9-character string)
    expect(addedPlant.id).toMatch(/^[a-z0-9]{9}$/)

    // Verify that other state properties remain unchanged
    expect(nextState.loading).toBe(false)
    expect(nextState.error).toBeNull()
    expect(nextState.wateringDays).toEqual({})
    expect(nextState.updatingWateringPeriod).toBeNull()
  })
}) 