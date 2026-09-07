import type { Animal } from './models'

type AnimalIdentification = Pick<
  Animal,
  | 'officialPrefix'
  | 'officialIndividual'
  | 'tagColor'
  | 'tagNumber'
>

export function formatAnimalIdentification(
  animal: AnimalIdentification,
): string {
  const identifications: string[] = []

  if (animal.officialPrefix && animal.officialIndividual) {
    identifications.push(
      `${animal.officialPrefix} ${animal.officialIndividual}`,
    )
  }

  if (animal.tagColor && animal.tagNumber) {
    identifications.push(`${animal.tagColor} ${animal.tagNumber}`)
  }

  return identifications.join(' · ')
}
