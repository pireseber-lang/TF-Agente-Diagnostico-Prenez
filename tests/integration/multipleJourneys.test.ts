import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it } from 'vitest'
import { filterAnimalsBySearch } from '../../src/domain/animalSearch'
import { findDuplicateMatches } from '../../src/domain/duplicateDetection'
import {
  calculateJourneyStatistics,
  formatPercentage,
} from '../../src/domain/journeyStatistics'
import type {
  DuplicateReviewEvidence,
  ValidatedAnimalData,
} from '../../src/domain/models'
import { getDatabase } from '../../src/infrastructure/db/database'
import {
  addAnimal,
  listAnimalsByJourney,
} from '../../src/infrastructure/db/repositories/animalRepository'
import {
  closeJourney,
  createJourney,
  getActiveJourney,
  getCurrentJourney,
} from '../../src/infrastructure/db/repositories/journeyRepository'

const oldAnimalData: ValidatedAnimalData = {
  officialPrefix: 'AI892',
  officialIndividual: 'PU50',
  diagnosis: 'Preñada Cabeza',
  dentition: 'Sin Diente',
  bodyCondition: 3,
  observations: 'Jornada anterior',
}

const newAnimalData: ValidatedAnimalData = {
  officialPrefix: 'OV319',
  officialIndividual: 'B728',
  diagnosis: 'Vacía',
  dentition: 'Diente cuarto',
  bodyCondition: 2.5,
  observations: 'Jornada nueva',
}

const previousReview: DuplicateReviewEvidence = {
  decision: 'keep-both',
  reviewedAt: '2026-09-08T12:00:00.000Z',
  matches: [{ animalId: 'animal-reference', reasons: ['official'] }],
}

beforeEach(async () => {
  const database = await getDatabase()
  await database.clear('animals')
  await database.clear('journeys')
})

describe('múltiples jornadas sin mezcla de datos', () => {
  it('crea una jornada nueva abierta sin modificar la jornada cerrada', async () => {
    const previousJourney = await createJourney(
      '2026-09-08',
      'Manga Casco',
    )
    const previousAnimal = await addAnimal(
      previousJourney.id,
      oldAnimalData,
      previousReview,
    )
    const previousClosedAt = '2026-09-08T18:00:00.000Z'
    await closeJourney(previousJourney.id, previousClosedAt)

    const newJourney = await createJourney(
      '2026-09-09',
      'Manga Complejo',
    )
    const database = await getDatabase()
    const persistedPrevious = await database.get(
      'journeys',
      previousJourney.id,
    )

    expect(newJourney.id).not.toBe(previousJourney.id)
    expect(newJourney.status).toBe('open')
    expect(newJourney.closedAt).toBeUndefined()
    expect(await listAnimalsByJourney(newJourney.id)).toEqual([])
    expect(persistedPrevious).toMatchObject({
      id: previousJourney.id,
      status: 'closed',
      closedAt: previousClosedAt,
    })
    expect(await listAnimalsByJourney(previousJourney.id)).toEqual([
      previousAnimal,
    ])
    expect(previousAnimal.duplicateReviews).toEqual([previousReview])
  })

  it('recupera como activa la jornada nueva abierta', async () => {
    const previousJourney = await createJourney(
      '2026-09-08',
      'Manga Casco',
    )
    await addAnimal(previousJourney.id, oldAnimalData)
    await closeJourney(previousJourney.id)
    const newJourney = await createJourney(
      '2026-09-09',
      'Manga Oro Monte',
    )

    expect(await getActiveJourney()).toEqual(newJourney)
    expect(await getCurrentJourney()).toEqual(newJourney)
  })

  it('mantiene compatibilidad con una jornada cerrada ya existente', async () => {
    const previousJourney = await createJourney(
      '2026-09-08',
      'Manga Casco',
    )
    await addAnimal(previousJourney.id, oldAnimalData)
    const closedJourney = await closeJourney(
      previousJourney.id,
      '2026-09-08T18:00:00.000Z',
    )

    expect(await getCurrentJourney()).toEqual(closedJourney)
  })

  it('asocia los animales nuevos solamente con la jornada nueva', async () => {
    const previousJourney = await createJourney(
      '2026-09-08',
      'Manga Casco',
    )
    const previousAnimal = await addAnimal(previousJourney.id, oldAnimalData)
    await closeJourney(previousJourney.id)
    const newJourney = await createJourney(
      '2026-09-09',
      'Manga Complejo',
    )
    const newAnimal = await addAnimal(newJourney.id, newAnimalData)

    expect(newAnimal.journeyId).toBe(newJourney.id)
    expect(await listAnimalsByJourney(newJourney.id)).toEqual([newAnimal])
    expect(await listAnimalsByJourney(previousJourney.id)).toEqual([
      previousAnimal,
    ])
  })

  it('reconstruye búsqueda, duplicados y estadísticas solo con la jornada activa', async () => {
    const previousJourney = await createJourney(
      '2026-09-08',
      'Manga Casco',
    )
    await addAnimal(previousJourney.id, oldAnimalData)
    await closeJourney(previousJourney.id)
    const newJourney = await createJourney(
      '2026-09-09',
      'Manga Complejo',
    )
    const newAnimal = await addAnimal(newJourney.id, newAnimalData)

    const recoveredJourney = await getCurrentJourney()
    const recoveredAnimals = await listAnimalsByJourney(
      recoveredJourney?.id ?? '',
    )

    expect(recoveredJourney?.id).toBe(newJourney.id)
    expect(recoveredAnimals).toEqual([newAnimal])
    expect(filterAnimalsBySearch(recoveredAnimals, 'AI892 PU50')).toEqual([])
    expect(findDuplicateMatches(oldAnimalData, recoveredAnimals)).toEqual([])

    const statistics = calculateJourneyStatistics(recoveredAnimals)
    expect(statistics.totalAnimals).toBe(1)
    expect(statistics.pregnant).toEqual({ count: 0, percentage: 0 })
    expect(statistics.empty).toEqual({ count: 1, percentage: 100 })
    expect(
      Object.values(statistics.pregnantBreakdown).map(({ percentage }) =>
        formatPercentage(percentage),
      ),
    ).toEqual(['0,0%', '0,0%', '0,0%', '0,0%'])
  })

  it('no permite crear otra jornada mientras ya existe una abierta', async () => {
    await createJourney('2026-09-09', 'Manga Casco')

    await expect(
      createJourney('2026-09-10', 'Manga Complejo'),
    ).rejects.toThrow('An open journey already exists')
  })
})
