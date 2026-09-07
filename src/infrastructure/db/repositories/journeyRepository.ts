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

export async function getActiveJourney(): Promise<Journey | undefined> {
  const database = await getDatabase()
  const openJourneys = await database.getAllFromIndex(
    'journeys',
    'by-status',
    'open',
  )

  return openJourneys.sort((left, right) =>
    right.createdAt.localeCompare(left.createdAt),
  )[0]
}
