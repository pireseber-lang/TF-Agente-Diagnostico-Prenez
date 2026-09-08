import type {
  Animal,
  DuplicateReviewEvidence,
  ValidatedAnimalData,
} from '../../../domain/models'
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
  duplicateReview?: DuplicateReviewEvidence,
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
    ...(duplicateReview ? { duplicateReviews: [duplicateReview] } : {}),
  }

  await transaction.store.add(animal)
  await transaction.done
  return animal
}

export async function updateAnimal(
  animalId: string,
  data: ValidatedAnimalData,
  duplicateReview?: DuplicateReviewEvidence,
): Promise<Animal> {
  const database = await getDatabase()
  const transaction = database.transaction('animals', 'readwrite')
  const currentAnimal = await transaction.store.get(animalId)

  if (!currentAnimal) {
    transaction.abort()
    throw new Error('Animal not found')
  }

  const updatedAnimal: Animal = {
    ...currentAnimal,
    officialPrefix: data.officialPrefix,
    officialIndividual: data.officialIndividual,
    tagColor: data.tagColor,
    tagNumber: data.tagNumber,
    diagnosis: data.diagnosis,
    dentition: data.dentition,
    bodyCondition: data.bodyCondition,
    observations: data.observations,
    id: currentAnimal.id,
    journeyId: currentAnimal.journeyId,
    sequence: currentAnimal.sequence,
    createdAt: currentAnimal.createdAt,
    updatedAt: new Date().toISOString(),
    duplicateReviews: duplicateReview
      ? [...(currentAnimal.duplicateReviews ?? []), duplicateReview]
      : currentAnimal.duplicateReviews,
  }

  await transaction.store.put(updatedAnimal)
  await transaction.done
  return updatedAnimal
}

export async function deleteAnimal(animalId: string): Promise<void> {
  const database = await getDatabase()
  await database.delete('animals', animalId)
}
