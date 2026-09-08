import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it } from 'vitest'
import { calculateJourneyStatistics } from '../../src/domain/journeyStatistics'
import type { Animal, Journey } from '../../src/domain/models'
import { getDatabase } from '../../src/infrastructure/db/database'
import { listAnimalsByJourney } from '../../src/infrastructure/db/repositories/animalRepository'
import {
  getCurrentJourney,
  listJourneyHistory,
} from '../../src/infrastructure/db/repositories/journeyRepository'

const olderJourney: Journey = {
  id: 'journey-older',
  date: '2026-09-07',
  place: 'Manga Casco',
  status: 'closed',
  createdAt: '2026-09-07T09:00:00.000Z',
  closedAt: '2026-09-07T18:00:00.000Z',
}

const recentJourney: Journey = {
  id: 'journey-recent',
  date: '2026-09-08',
  place: 'Manga Oro Monte',
  status: 'closed',
  createdAt: '2026-09-08T09:00:00.000Z',
  closedAt: '2026-09-08T18:00:00.000Z',
}

function animal(
  id: string,
  journeyId: string,
  sequence: number,
  diagnosis: Animal['diagnosis'],
): Animal {
  return {
    id,
    journeyId,
    sequence,
    officialPrefix: 'AI',
    officialIndividual: id,
    diagnosis,
    dentition: 'Diente lleno',
    bodyCondition: 3,
    observations: '',
    createdAt: `${journeyId === olderJourney.id ? '2026-09-07' : '2026-09-08'}T10:00:00.000Z`,
  }
}

const olderAnimals = [
  animal('animal-old-1', olderJourney.id, 1, 'Preñada Cabeza'),
  animal('animal-old-2', olderJourney.id, 2, 'Vacía'),
]
const recentAnimals = [
  animal('animal-recent-1', recentJourney.id, 1, 'Vacía'),
]

beforeEach(async () => {
  const database = await getDatabase()
  await database.clear('animals')
  await database.clear('journeys')
})

async function persistHistoryFixtures() {
  const database = await getDatabase()
  await database.add('journeys', olderJourney)
  await database.add('journeys', recentJourney)
  for (const storedAnimal of [...olderAnimals, ...recentAnimals]) {
    await database.add('animals', storedAnimal)
  }
}

describe('historial de jornadas', () => {
  it('obtiene todas las jornadas, ordenadas de más reciente a más antigua y con sus cantidades', async () => {
    await persistHistoryFixtures()

    const history = await listJourneyHistory()

    expect(history).toEqual([
      { journey: recentJourney, animalCount: 1 },
      { journey: olderJourney, animalCount: 2 },
    ])
    expect(history.map(({ journey }) => ({
      date: journey.date,
      place: journey.place,
      status: journey.status,
    }))).toEqual([
      {
        date: '2026-09-08',
        place: 'Manga Oro Monte',
        status: 'closed',
      },
      {
        date: '2026-09-07',
        place: 'Manga Casco',
        status: 'closed',
      },
    ])
  })

  it('consultar una jornada histórica no cambia la jornada actual ni modifica datos', async () => {
    await persistHistoryFixtures()
    const database = await getDatabase()
    const currentBefore = await getCurrentJourney()
    const journeysBefore = await database.getAll('journeys')
    const animalsBefore = await database.getAll('animals')

    await listJourneyHistory()
    await listAnimalsByJourney(olderJourney.id)

    expect(await getCurrentJourney()).toEqual(currentBefore)
    expect(await database.getAll('journeys')).toEqual(journeysBefore)
    expect(await database.getAll('animals')).toEqual(animalsBefore)
  })

  it('filtra los animales por journeyId sin mezclar jornadas', async () => {
    await persistHistoryFixtures()

    expect(await listAnimalsByJourney(olderJourney.id)).toEqual(olderAnimals)
    expect(await listAnimalsByJourney(recentJourney.id)).toEqual(
      recentAnimals,
    )
  })

  it('calcula cada resumen exclusivamente con los animales de su jornada', async () => {
    await persistHistoryFixtures()
    const olderStatistics = calculateJourneyStatistics(
      await listAnimalsByJourney(olderJourney.id),
    )
    const recentStatistics = calculateJourneyStatistics(
      await listAnimalsByJourney(recentJourney.id),
    )

    expect(olderStatistics.totalAnimals).toBe(2)
    expect(olderStatistics.pregnant).toEqual({ count: 1, percentage: 50 })
    expect(recentStatistics.totalAnimals).toBe(1)
    expect(recentStatistics.pregnant).toEqual({ count: 0, percentage: 0 })
  })

  it('devuelve una lista vacía cuando no existen jornadas', async () => {
    expect(await listJourneyHistory()).toEqual([])
  })
})
