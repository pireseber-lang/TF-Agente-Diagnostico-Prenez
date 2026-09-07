import type { Animal, ValidatedAnimalData } from '../../../domain/models'
import { getDatabase } from '../database'

export async function listAnimalsByJourney(
  journeyId: string,
): Promise<Animal[]> {
  const database = await getDatabase()
  const animals = await database.getAllFromIndex(
    'animals',
    'by-journey-id',
    journeyId,
  )

  return animals.sort((left, right) => left.sequence - right.sequence)
}

export async function addAnimal(
  journeyId: string,
  data: ValidatedAnimalData,
): Promise<Animal> {
  const database = await getDatabase()
  const transaction = database.transaction('animals', 'readwrite')
  const existingAnimals = await transaction.store
    .index('by-journey-id')
    .getAll(journeyId)
  const nextSequence =
    existingAnimals.reduce(
      (maximum, animal) => Math.max(maximum, animal.sequence),
      0,
    ) + 1

  const animal: Animal = {
    id: crypto.randomUUID(),
    journeyId,
    sequence: nextSequence,
    ...data,
    createdAt: new Date().toISOString(),
  }

  await transaction.store.add(animal)
  await transaction.done
  return animal
}
