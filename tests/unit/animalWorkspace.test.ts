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
    const state = {
      animals: [animal],
      screen: 'entry' as const,
      editingAnimalId: animal.id,
    }
    const result = animalWorkspaceReducer(state, { type: 'editingCanceled' })

    expect(result.animals).toBe(state.animals)
    expect(result.animals).toEqual([animal])
    expect(result.editingAnimalId).toBeUndefined()
    expect(result.screen).toBe('animals')
  })

  it('eliminar quita el registro y actualiza la cantidad del listado', () => {
    const secondAnimal = { ...animal, id: 'animal-2', sequence: 2 }
    const result = animalWorkspaceReducer(
      { animals: [animal, secondAnimal], screen: 'animals' },
      { type: 'animalDeleted', animalId: animal.id },
    )

    expect(result.animals).toEqual([secondAnimal])
    expect(result.animals).toHaveLength(1)
  })

  it('navega entre carga y animales sin modificar los registros', () => {
    const state = { animals: [animal], screen: 'entry' as const }
    const listState = animalWorkspaceReducer(state, { type: 'animalsShown' })
    const entryState = animalWorkspaceReducer(listState, {
      type: 'entryShown',
    })

    expect(listState.screen).toBe('animals')
    expect(entryState.screen).toBe('entry')
    expect(entryState.animals).toBe(state.animals)
  })

  it('guardar un animal incrementa el contador y permanece en carga', () => {
    const result = animalWorkspaceReducer(
      { animals: [], screen: 'entry' },
      { type: 'animalCreated', animal },
    )

    expect(result.animals).toHaveLength(1)
    expect(result.screen).toBe('entry')
  })

  it('editar abre la carga y guardar cambios vuelve al listado', () => {
    const listState = { animals: [animal], screen: 'animals' as const }
    const editState = animalWorkspaceReducer(listState, {
      type: 'editingStarted',
      animalId: animal.id,
    })
    const updatedAnimal = { ...animal, observations: 'Editado' }
    const savedState = animalWorkspaceReducer(editState, {
      type: 'animalUpdated',
      animal: updatedAnimal,
    })

    expect(editState.screen).toBe('entry')
    expect(editState.editingAnimalId).toBe(animal.id)
    expect(savedState.screen).toBe('animals')
    expect(savedState.editingAnimalId).toBeUndefined()
    expect(savedState.animals).toEqual([updatedAnimal])
  })
})
