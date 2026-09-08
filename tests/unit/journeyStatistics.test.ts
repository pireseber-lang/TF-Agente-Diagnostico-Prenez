import { describe, expect, it } from 'vitest'
import {
  calculateJourneyStatistics,
  formatPercentage,
  getDuplicateReviewedAnimals,
} from '../../src/domain/journeyStatistics'
import type { Animal } from '../../src/domain/models'

function animal(
  id: string,
  diagnosis: Animal['diagnosis'],
  dentition: Animal['dentition'],
): Animal {
  return {
    id,
    journeyId: 'journey-1',
    sequence: Number(id.replace('animal-', '')),
    officialPrefix: 'AI',
    officialIndividual: id,
    diagnosis,
    dentition,
    bodyCondition: 3,
    observations: '',
    createdAt: '2026-09-08T10:00:00.000Z',
  }
}

const representativeAnimals = [
  animal('animal-1', 'Preñada Cabeza', 'Sin Diente'),
  animal('animal-2', 'Preñada Cabeza', 'Diente lleno'),
  animal('animal-3', 'Preñada Cuerpo', 'Diente cuarto'),
  animal('animal-4', 'Preñada Cola', 'Sin Diente'),
  animal('animal-5', 'Vacía', 'Diente medio'),
  animal('animal-6', 'Vacía', 'Diente lleno'),
]

describe('calculateJourneyStatistics', () => {
  const statistics = calculateJourneyStatistics(representativeAnimals)

  it('calcula el total de preñadas', () => {
    expect(statistics.pregnant.count).toBe(4)
  })

  it('calcula el total de vacías', () => {
    expect(statistics.empty.count).toBe(2)
  })

  it('calcula el porcentaje de preñez sobre el total de vacas', () => {
    expect(statistics.pregnant.percentage).toBe(66.7)
  })

  it('calcula el porcentaje de vacías sobre el total de vacas', () => {
    expect(statistics.empty.percentage).toBe(33.3)
  })

  it('calcula Cabeza sobre el total de preñadas', () => {
    expect(statistics.pregnantBreakdown['Preñada Cabeza']).toEqual({
      count: 2,
      percentage: 50,
    })
  })

  it('calcula Cuerpo sobre el total de preñadas', () => {
    expect(statistics.pregnantBreakdown['Preñada Cuerpo']).toEqual({
      count: 1,
      percentage: 25,
    })
  })

  it('calcula Cola sobre el total de preñadas', () => {
    expect(statistics.pregnantBreakdown['Preñada Cola']).toEqual({
      count: 1,
      percentage: 25,
    })
  })

  it('calcula Robo sobre el total de preñadas', () => {
    expect(statistics.pregnantBreakdown['Preñada Robo']).toEqual({
      count: 0,
      percentage: 0,
    })
  })

  it('devuelve 0,0% para cada categoría cuando no hay preñadas', () => {
    const onlyEmpty = [animal('animal-7', 'Vacía', 'Diente lleno')]
    const result = calculateJourneyStatistics(onlyEmpty)

    expect(
      Object.values(result.pregnantBreakdown).map(
        (metric) => formatPercentage(metric.percentage),
      ),
    ).toEqual(['0,0%', '0,0%', '0,0%', '0,0%'])
  })

  it('la suma de las categorías coincide con el total de preñadas', () => {
    const breakdownTotal = Object.values(statistics.pregnantBreakdown).reduce(
      (total, metric) => total + metric.count,
      0,
    )

    expect(breakdownTotal).toBe(statistics.pregnant.count)
  })

  it('la suma de preñadas y vacías coincide con el total', () => {
    expect(statistics.pregnant.count + statistics.empty.count).toBe(
      statistics.totalAnimals,
    )
  })

  it('cuenta Sin Diente y calcula su porcentaje sobre el total', () => {
    expect(statistics.oldCows.noTeeth).toEqual({
      count: 2,
      percentage: 33.3,
    })
  })

  it('devuelve 0,0% cuando no hay vacas Sin Diente', () => {
    const result = calculateJourneyStatistics([
      animal('animal-7', 'Vacía', 'Diente lleno'),
    ])

    expect(result.oldCows.noTeeth).toEqual({ count: 0, percentage: 0 })
    expect(formatPercentage(result.oldCows.noTeeth.percentage)).toBe('0,0%')
  })

  it('cuenta Diente Cuarto y calcula su porcentaje sobre el total', () => {
    expect(statistics.oldCows.quarterTooth).toEqual({
      count: 1,
      percentage: 16.7,
    })
  })

  it('devuelve 0,0% cuando no hay vacas Diente Cuarto', () => {
    const result = calculateJourneyStatistics([
      animal('animal-7', 'Vacía', 'Diente lleno'),
    ])

    expect(result.oldCows.quarterTooth).toEqual({ count: 0, percentage: 0 })
    expect(formatPercentage(result.oldCows.quarterTooth.percentage)).toBe(
      '0,0%',
    )
  })

  it('reconstruye el mismo resumen a partir de los mismos registros', () => {
    expect(calculateJourneyStatistics(representativeAnimals)).toEqual(
      calculateJourneyStatistics(representativeAnimals),
    )
  })

  it('no modifica los registros originales', () => {
    const snapshot = JSON.stringify(representativeAnimals)

    calculateJourneyStatistics(representativeAnimals)

    expect(JSON.stringify(representativeAnimals)).toBe(snapshot)
  })
})

describe('getDuplicateReviewedAnimals', () => {
  it('devuelve solamente registros con evidencia de revisión humana', () => {
    const reviewed = {
      ...representativeAnimals[0],
      duplicateReviews: [
        {
          decision: 'keep-both' as const,
          reviewedAt: '2026-09-08T12:00:00.000Z',
          matches: [{ animalId: 'animal-9', reasons: ['official' as const] }],
        },
      ],
    }

    expect(
      getDuplicateReviewedAnimals([reviewed, representativeAnimals[1]]),
    ).toEqual([reviewed])
  })
})
