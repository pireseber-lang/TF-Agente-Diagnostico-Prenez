import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it } from 'vitest'
import type { ValidatedAnimalData } from '../../src/domain/models'
import { getDatabase } from '../../src/infrastructure/db/database'
import {
  addAnimal,
  listAnimalsByJourney,
} from '../../src/infrastructure/db/repositories/animalRepository'
import {
  closeJourney,
  createJourney,
  getLatestJourney,
} from '../../src/infrastructure/db/repositories/journeyRepository'

const animalData: ValidatedAnimalData = {
  officialPrefix: 'AI892',
  officialIndividual: 'PU50',
  diagnosis: 'Preñada Cabeza',
  dentition: 'Diente lleno',
  bodyCondition: 3,
  observations: '',
}

beforeEach(async () => {
  const database = await getDatabase()
  await database.clear('animals')
  await database.clear('journeys')
})

describe('journeyRepository', () => {
  it('no permite cerrar una jornada vacía', async () => {
    const journey = await createJourney('2026-09-08', 'Manga Casco')

    await expect(closeJourney(journey.id)).rejects.toThrow(
      'Cannot close an empty journey',
    )
    const recoveredJourney = await getLatestJourney()
    expect(recoveredJourney).toMatchObject({
      id: journey.id,
      status: 'open',
    })
    expect(recoveredJourney?.closedAt).toBeUndefined()
  })

  it('cambia el estado de abierta a cerrada y guarda fecha y hora', async () => {
    const journey = await createJourney('2026-09-08', 'Manga Complejo')
    await addAnimal(journey.id, animalData)
    const closedAt = '2026-09-08T18:35:00.000Z'

    const closed = await closeJourney(journey.id, closedAt)

    expect(closed.status).toBe('closed')
    expect(closed.closedAt).toBe(closedAt)
  })

  it('una jornada cerrada no admite nuevas cargas', async () => {
    const journey = await createJourney('2026-09-08', 'Manga Oro Monte')
    await addAnimal(journey.id, animalData)
    await closeJourney(journey.id)

    await expect(addAnimal(journey.id, animalData)).rejects.toThrow(
      'Cannot add animals to a closed journey',
    )
    expect(await listAnimalsByJourney(journey.id)).toHaveLength(1)
  })

  it('recupera la jornada cerrada y conserva sus animales', async () => {
    const journey = await createJourney('2026-09-08', 'Manga Casco')
    const animal = await addAnimal(journey.id, animalData)
    const closedAt = '2026-09-08T19:00:00.000Z'
    await closeJourney(journey.id, closedAt)

    const recoveredJourney = await getLatestJourney()
    const recoveredAnimals = await listAnimalsByJourney(journey.id)

    expect(recoveredJourney).toMatchObject({
      id: journey.id,
      status: 'closed',
      closedAt,
    })
    expect(recoveredAnimals).toEqual([animal])
  })
})
