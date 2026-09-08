import type { Animal } from '../../domain/models'

export interface AnimalWorkspaceState {
  animals: Animal[]
  screen: 'entry' | 'animals'
  editingAnimalId?: string
}

export const initialAnimalWorkspaceState: AnimalWorkspaceState = {
  animals: [],
  screen: 'entry',
}

export type AnimalWorkspaceAction =
  | { type: 'animalsLoaded'; animals: Animal[] }
  | { type: 'animalCreated'; animal: Animal }
  | { type: 'animalsShown' }
  | { type: 'entryShown' }
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
      return { animals: action.animals, screen: 'entry' }
    case 'animalCreated':
      return { ...state, animals: [...state.animals, action.animal] }
    case 'animalsShown':
      return { ...state, screen: 'animals', editingAnimalId: undefined }
    case 'entryShown':
      return { ...state, screen: 'entry', editingAnimalId: undefined }
    case 'editingStarted':
      return state.animals.some((animal) => animal.id === action.animalId)
        ? {
            ...state,
            screen: 'entry',
            editingAnimalId: action.animalId,
          }
        : state
    case 'editingCanceled':
      return { ...state, screen: 'animals', editingAnimalId: undefined }
    case 'animalUpdated':
      return {
        animals: state.animals.map((animal) =>
          animal.id === action.animal.id ? action.animal : animal,
        ),
        screen: 'animals',
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
        screen: state.screen,
      }
  }
}
