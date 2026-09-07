import { describe, expect, it } from 'vitest'
import type { Animal } from '../../src/domain/models'
import { animalWorkspaceReducer } from '../../src/features/animals/animalWorkspace'

const animal: Animal = {
  id: 'animal-1',
  journeyId: 'journey-1',
  sequence: 1,
  officialPrefix: 'AI892',
  officialIndividual: 'PU50',
  diagnosis: 'Preñada Cabeza',
  dentition: 'Diente lleno',
  bodyCondition: 3,
  observations: '',
  createdAt: '2026-09-07T10:00:00.000Z',
}

describe('animalWorkspaceReducer', () => {
  it('cancelar la edición no altera los animales', () => {
    const state = { animals: [animal], editingAnimalId: animal.id }
    const result = animalWorkspaceReducer(state, { type: 'editingCanceled' })

    expect(result.animals).toBe(state.animals)
    expect(result.animals).toEqual([animal])
    expect(result.editingAnimalId).toBeUndefined()
  })

  it('eliminar quita el registro y actualiza la cantidad del listado', () => {
    const secondAnimal = { ...animal, id: 'animal-2', sequence: 2 }
    const result = animalWorkspaceReducer(
      { animals: [animal, secondAnimal] },
      { type: 'animalDeleted', animalId: animal.id },
    )

    expect(result.animals).toEqual([secondAnimal])
    expect(result.animals).toHaveLength(1)
  })
})
