import type { Animal } from './models'
import { normalizeIdentifier } from './normalization'

export function matchesAnimalSearch(animal: Animal, query: string): boolean {
  const normalizedQuery = normalizeIdentifier(query)
  if (!normalizedQuery) return true

  const officialPrefix = normalizeIdentifier(animal.officialPrefix ?? '')
  const officialIndividual = normalizeIdentifier(
    animal.officialIndividual ?? '',
  )
  const tagColor = normalizeIdentifier(animal.tagColor ?? '')
  const tagNumber = normalizeIdentifier(animal.tagNumber ?? '')

  const searchableValues = [
    officialPrefix,
    officialIndividual,
    `${officialPrefix}${officialIndividual}`,
    tagColor,
    tagNumber,
    `${tagColor}${tagNumber}`,
  ]

  return searchableValues.some((value) => value.includes(normalizedQuery))
}

export function filterAnimalsBySearch(
  animals: Animal[],
  query: string,
): Animal[] {
  return animals.filter((animal) => matchesAnimalSearch(animal, query))
}
