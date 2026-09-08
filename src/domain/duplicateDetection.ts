import type {
  Animal,
  DuplicateMatchReason,
  DuplicateReviewEvidence,
  ValidatedAnimalData,
} from './models'
import { normalizeIdentifier } from './normalization'

export interface DuplicateMatch {
  animal: Animal
  reasons: DuplicateMatchReason[]
}

function hasSameOfficialIdentification(
  candidate: ValidatedAnimalData,
  existing: Animal,
): boolean {
  if (
    !candidate.officialPrefix ||
    !candidate.officialIndividual ||
    !existing.officialPrefix ||
    !existing.officialIndividual
  ) {
    return false
  }

  return (
    normalizeIdentifier(candidate.officialPrefix) ===
      normalizeIdentifier(existing.officialPrefix) &&
    normalizeIdentifier(candidate.officialIndividual) ===
      normalizeIdentifier(existing.officialIndividual)
  )
}

function hasSameColorTag(
  candidate: ValidatedAnimalData,
  existing: Animal,
): boolean {
  if (
    !candidate.tagColor ||
    !candidate.tagNumber ||
    !existing.tagColor ||
    !existing.tagNumber
  ) {
    return false
  }

  return (
    normalizeIdentifier(candidate.tagColor) ===
      normalizeIdentifier(existing.tagColor) &&
    normalizeIdentifier(candidate.tagNumber) ===
      normalizeIdentifier(existing.tagNumber)
  )
}

export function findDuplicateMatches(
  candidate: ValidatedAnimalData,
  animals: Animal[],
  excludedAnimalId?: string,
): DuplicateMatch[] {
  return animals.flatMap((animal) => {
    if (animal.id === excludedAnimalId) return []

    const reasons: DuplicateMatchReason[] = []
    if (hasSameOfficialIdentification(candidate, animal)) {
      reasons.push('official')
    }
    if (hasSameColorTag(candidate, animal)) {
      reasons.push('colorTag')
    }

    return reasons.length > 0 ? [{ animal, reasons }] : []
  })
}

export function createDuplicateReviewEvidence(
  matches: DuplicateMatch[],
  reviewedAt = new Date().toISOString(),
): DuplicateReviewEvidence {
  return {
    decision: 'keep-both',
    reviewedAt,
    matches: matches.map(({ animal, reasons }) => ({
      animalId: animal.id,
      reasons: [...reasons],
    })),
  }
}
