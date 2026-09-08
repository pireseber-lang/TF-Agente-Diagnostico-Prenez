import type { Diagnosis } from './catalogs'
import type { Animal } from './models'

const PREGNANT_DIAGNOSES = [
  'Preñada Cabeza',
  'Preñada Cuerpo',
  'Preñada Cola',
  'Preñada Robo',
] as const satisfies readonly Diagnosis[]

export type PregnantDiagnosis = (typeof PREGNANT_DIAGNOSES)[number]

export interface CountPercentage {
  count: number
  percentage: number
}

export interface JourneyStatistics {
  totalAnimals: number
  pregnant: CountPercentage
  empty: CountPercentage
  pregnantBreakdown: Record<PregnantDiagnosis, CountPercentage>
  oldCows: {
    noTeeth: CountPercentage
    quarterTooth: CountPercentage
  }
}

function percentage(count: number, total: number): number {
  if (total === 0) return 0
  return Math.round((count / total) * 1000) / 10
}

function metric(count: number, total: number): CountPercentage {
  return { count, percentage: percentage(count, total) }
}

export function calculateJourneyStatistics(
  animals: readonly Animal[],
): JourneyStatistics {
  const totalAnimals = animals.length
  const pregnantCounts: Record<PregnantDiagnosis, number> = {
    'Preñada Cabeza': 0,
    'Preñada Cuerpo': 0,
    'Preñada Cola': 0,
    'Preñada Robo': 0,
  }
  let emptyCount = 0
  let noTeethCount = 0
  let quarterToothCount = 0

  for (const animal of animals) {
    if (animal.diagnosis === 'Vacía') {
      emptyCount += 1
    } else {
      pregnantCounts[animal.diagnosis] += 1
    }

    if (animal.dentition === 'Sin Diente') noTeethCount += 1
    if (animal.dentition === 'Diente cuarto') quarterToothCount += 1
  }

  const pregnantCount = PREGNANT_DIAGNOSES.reduce(
    (total, diagnosis) => total + pregnantCounts[diagnosis],
    0,
  )

  return {
    totalAnimals,
    pregnant: metric(pregnantCount, totalAnimals),
    empty: metric(emptyCount, totalAnimals),
    pregnantBreakdown: {
      'Preñada Cabeza': metric(
        pregnantCounts['Preñada Cabeza'],
        pregnantCount,
      ),
      'Preñada Cuerpo': metric(
        pregnantCounts['Preñada Cuerpo'],
        pregnantCount,
      ),
      'Preñada Cola': metric(
        pregnantCounts['Preñada Cola'],
        pregnantCount,
      ),
      'Preñada Robo': metric(
        pregnantCounts['Preñada Robo'],
        pregnantCount,
      ),
    },
    oldCows: {
      noTeeth: metric(noTeethCount, totalAnimals),
      quarterTooth: metric(quarterToothCount, totalAnimals),
    },
  }
}

export function formatPercentage(percentageValue: number): string {
  return `${percentageValue.toFixed(1).replace('.', ',')}%`
}

export function getDuplicateReviewedAnimals(
  animals: readonly Animal[],
): Animal[] {
  return animals.filter((animal) => (animal.duplicateReviews?.length ?? 0) > 0)
}
