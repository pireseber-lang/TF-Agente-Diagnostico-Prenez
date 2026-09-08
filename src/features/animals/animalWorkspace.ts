import type { DuplicateMatch } from '../../domain/duplicateDetection'
import type { Animal, ValidatedAnimalData } from '../../domain/models'

export interface PendingDuplicateReview {
  data: ValidatedAnimalData
  matches: DuplicateMatch[]
  editingAnimalId?: string
}

export interface AnimalWorkspaceState {
  animals: Animal[]
  screen: 'entry' | 'animals' | 'closing'
  editingAnimalId?: string
  pendingDuplicateReview?: PendingDuplicateReview
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
  | { type: 'closingStarted' }
  | { type: 'closingCanceled' }
  | { type: 'journeyClosed' }
  | { type: 'editingStarted'; animalId: string }
  | { type: 'editingCanceled' }
  | { type: 'duplicateReviewRequested'; review: PendingDuplicateReview }
  | { type: 'duplicateReviewCanceled' }
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
      return {
        ...state,
        animals: [...state.animals, action.animal],
        pendingDuplicateReview: undefined,
      }
    case 'animalsShown':
      return {
        ...state,
        screen: 'animals',
        editingAnimalId: undefined,
        pendingDuplicateReview: undefined,
      }
    case 'entryShown':
      return {
        ...state,
        screen: 'entry',
        editingAnimalId: undefined,
        pendingDuplicateReview: undefined,
      }
    case 'closingStarted':
      return state.animals.length === 0
        ? state
        : {
            ...state,
            screen: 'closing',
            editingAnimalId: undefined,
            pendingDuplicateReview: undefined,
          }
    case 'closingCanceled':
    case 'journeyClosed':
      return {
        ...state,
        screen: 'entry',
        editingAnimalId: undefined,
        pendingDuplicateReview: undefined,
      }
    case 'editingStarted':
      return state.animals.some((animal) => animal.id === action.animalId)
        ? {
            ...state,
            screen: 'entry',
            editingAnimalId: action.animalId,
            pendingDuplicateReview: undefined,
          }
        : state
    case 'editingCanceled':
      return {
        ...state,
        screen: 'animals',
        editingAnimalId: undefined,
        pendingDuplicateReview: undefined,
      }
    case 'duplicateReviewRequested':
      return { ...state, pendingDuplicateReview: action.review }
    case 'duplicateReviewCanceled':
      return { ...state, pendingDuplicateReview: undefined }
    case 'animalUpdated':
      return {
        animals: state.animals.map((animal) =>
          animal.id === action.animal.id ? action.animal : animal,
        ),
        screen: 'animals',
        pendingDuplicateReview: undefined,
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
