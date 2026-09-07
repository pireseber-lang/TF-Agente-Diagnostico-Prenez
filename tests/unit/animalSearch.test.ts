import { describe, expect, it } from 'vitest'
import type { Animal } from '../../src/domain/models'
import { filterAnimalsBySearch } from '../../src/domain/animalSearch'

const animals: Animal[] = [
  {
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
  },
  {
    id: 'animal-2',
    journeyId: 'journey-1',
    sequence: 2,
    tagColor: 'Verde',
    tagNumber: '1342',
    diagnosis: 'Vacía',
    dentition: 'Diente medio',
    bodyCondition: 2.5,
    observations: '',
    createdAt: '2026-09-07T10:01:00.000Z',
  },
]

describe('filterAnimalsBySearch', () => {
  it('busca por identificación oficial completa ignorando espacios y mayúsculas', () => {
    expect(filterAnimalsBySearch(animals, 'ai892 pu50')).toEqual([animals[0]])
  })

  it('busca por combinación de color y número de caravana', () => {
    expect(filterAnimalsBySearch(animals, 'VERDE 1342')).toEqual([animals[1]])
  })

  it('busca por color de caravana sin indicar el número', () => {
    expect(filterAnimalsBySearch(animals, 'verde')).toEqual([animals[1]])
  })

  it('devuelve una lista vacía cuando no hay coincidencias', () => {
    expect(filterAnimalsBySearch(animals, 'ROJO 999')).toEqual([])
  })
})
