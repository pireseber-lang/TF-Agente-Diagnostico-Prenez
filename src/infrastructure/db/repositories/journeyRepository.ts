import type { Place } from '../../../domain/catalogs'
import type { Journey } from '../../../domain/models'
import { getDatabase } from '../database'

export async function createJourney(
  date: string,
  place: Place,
): Promise<Journey> {
  const journey: Journey = {
    id: crypto.randomUUID(),
    date,
    place,
    status: 'open',
    createdAt: new Date().toISOString(),
  }

  const database = await getDatabase()
  await database.add('journeys', journey)
  return journey
}

export async function getLatestJourney(): Promise<Journey | undefined> {
  const database = await getDatabase()
  const journeys = await database.getAllFromIndex(
    'journeys',
    'by-created-at',
  )

  return journeys.sort((left, right) =>
    right.createdAt.localeCompare(left.createdAt),
  )[0]
}

export async function closeJourney(
  journeyId: string,
  closedAt = new Date().toISOString(),
): Promise<Journey> {
  const database = await getDatabase()
  const transaction = database.transaction(
    ['journeys', 'animals'],
    'readwrite',
  )
  const journey = await transaction.objectStore('journeys').get(journeyId)

  if (!journey) throw new Error('Journey not found')
  if (journey.status === 'closed') {
    await transaction.done
    return journey
  }

  const animalCount = await transaction
    .objectStore('animals')
    .index('by-journey-id')
    .count(journeyId)

  if (animalCount === 0) {
    throw new Error('Cannot close an empty journey')
  }

  const closedJourney: Journey = {
    ...journey,
    status: 'closed',
    closedAt,
  }

  await transaction.objectStore('journeys').put(closedJourney)
  await transaction.done
  return closedJourney
}
