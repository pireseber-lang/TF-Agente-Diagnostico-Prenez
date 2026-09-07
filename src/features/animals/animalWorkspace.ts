import type { Animal } from '../../domain/models'

export interface AnimalWorkspaceState {
  animals: Animal[]
  editingAnimalId?: string
}

export const initialAnimalWorkspaceState: AnimalWorkspaceState = {
  animals: [],
}

export type AnimalWorkspaceAction =
  | { type: 'animalsLoaded'; animals: Animal[] }
  | { type: 'animalCreated'; animal: Animal }
  | { type: 'editingStarted'; animalId: string }
  | { type: 'editingCanceled' }
  | { type: 'animalUpdated'; animal: Animal }
  | { type: 'animalDeleted'; animalId: string }

export function animalWorkspaceReducer(
  state: AnimalWorkspaceState,
  action: AnimalWorkspaceAction,
): AnimalWorkspaceState {
  switch (action.type) {
    case 'animalsLoaded':
      return { animals: action.animals }
    case 'animalCreated':
      return { ...state, animals: [...state.animals, action.animal] }
    case 'editingStarted':
      return state.animals.some((animal) => animal.id === action.animalId)
        ? { ...state, editingAnimalId: action.animalId }
        : state
    case 'editingCanceled':
      return { ...state, editingAnimalId: undefined }
    case 'animalUpdated':
      return {
        animals: state.animals.map((animal) =>
          animal.id === action.animal.id ? action.animal : animal,
        ),
      }
    case 'animalDeleted':
      return {
        animals: state.animals.filter(
          (animal) => animal.id !== action.animalId,
        ),
        editingAnimalId:
          state.editingAnimalId === action.animalId
            ? undefined
            : state.editingAnimalId,
      }
  }
}
