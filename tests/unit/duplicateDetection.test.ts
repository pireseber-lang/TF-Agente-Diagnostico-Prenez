import { describe, expect, it } from 'vitest'
import type { Animal, ValidatedAnimalData } from '../../src/domain/models'
import { findDuplicateMatches } from '../../src/domain/duplicateDetection'

const existingAnimal: Animal = {
  id: 'animal-1',
  journeyId: 'journey-1',
  sequence: 1,
  officialPrefix: 'AI892',
  officialIndividual: 'PU50',
  tagColor: 'Verde',
  tagNumber: '1342',
  diagnosis: 'Preñada Cabeza',
  dentition: 'Diente lleno',
  bodyCondition: 3,
  observations: '',
  createdAt: '2026-09-07T10:00:00.000Z',
}

function candidate(
  overrides: Partial<ValidatedAnimalData> = {},
): ValidatedAnimalData {
  return {
    officialPrefix: 'OV319',
    officialIndividual: 'B728',
    diagnosis: 'Vacía',
    dentition: 'Diente medio',
    bodyCondition: 2.5,
    observations: '',
    ...overrides,
  }
}

describe('findDuplicateMatches', () => {
  it('detecta el mismo prefijo e identificación individual', () => {
    const matches = findDuplicateMatches(
      candidate({
        officialPrefix: 'AI892',
        officialIndividual: 'PU50',
      }),
      [existingAnimal],
    )

    expect(matches).toHaveLength(1)
    expect(matches[0]?.reasons).toContain('official')
  })

  it('detecta el mismo color y número de caravana', () => {
    const matches = findDuplicateMatches(
      candidate({ tagColor: 'Verde', tagNumber: '1342' }),
      [existingAnimal],
    )

    expect(matches).toHaveLength(1)
    expect(matches[0]?.reasons).toContain('colorTag')
  })

  it('no marca duplicado si coincide solo el prefijo', () => {
    const matches = findDuplicateMatches(
      candidate({
        officialPrefix: 'AI892',
        officialIndividual: 'OTRO1',
      }),
      [existingAnimal],
    )

    expect(matches).toEqual([])
  })

  it('no marca duplicado si coincide solo el color', () => {
    const matches = findDuplicateMatches(
      candidate({ tagColor: 'Verde', tagNumber: '9999' }),
      [existingAnimal],
    )

    expect(matches).toEqual([])
  })

  it('ignora diferencias de mayúsculas, minúsculas y espacios', () => {
    const matches = findDuplicateMatches(
      candidate({
        officialPrefix: ' ai 892 ',
        officialIndividual: ' pu 50 ',
      }),
      [existingAnimal],
    )

    expect(matches).toHaveLength(1)
  })

  it('durante edición excluye al propio animal', () => {
    const matches = findDuplicateMatches(
      candidate({
        officialPrefix: 'AI892',
        officialIndividual: 'PU50',
      }),
      [existingAnimal],
      existingAnimal.id,
    )

    expect(matches).toEqual([])
  })

  it('durante edición detecta la coincidencia con otro animal', () => {
    const editedAnimal = { ...existingAnimal, id: 'animal-2', sequence: 2 }
    const matches = findDuplicateMatches(
      candidate({
        officialPrefix: 'AI892',
        officialIndividual: 'PU50',
      }),
      [existingAnimal, editedAnimal],
      editedAnimal.id,
    )

    expect(matches.map(({ animal }) => animal.id)).toEqual([
      existingAnimal.id,
    ])
  })
})
