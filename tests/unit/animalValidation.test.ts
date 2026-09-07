import { describe, expect, it } from 'vitest'
import type { AnimalDraft } from '../../src/domain/models'
import { validateAnimalDraft } from '../../src/domain/validation/animalValidation'

function validDraft(overrides: Partial<AnimalDraft> = {}): AnimalDraft {
  return {
    officialPrefix: 'AI892',
    officialIndividual: 'PU50',
    tagColor: '',
    tagNumber: '',
    diagnosis: 'Preñada Cabeza',
    dentition: 'Diente lleno',
    bodyCondition: 3,
    observations: '',
    ...overrides,
  }
}

describe('validateAnimalDraft', () => {
  it('acepta una identificación oficial completa', () => {
    expect(validateAnimalDraft(validDraft()).valid).toBe(true)
  })

  it('acepta una caravana de color completa', () => {
    const result = validateAnimalDraft(
      validDraft({
        officialPrefix: '',
        officialIndividual: '',
        tagColor: 'Verde',
        tagNumber: '1342',
      }),
    )

    expect(result.valid).toBe(true)
  })

  it('acepta ambas identificaciones completas', () => {
    const result = validateAnimalDraft(
      validDraft({ tagColor: 'Rojo', tagNumber: '528' }),
    )

    expect(result.valid).toBe(true)
  })

  it('rechaza un animal sin identificación', () => {
    const result = validateAnimalDraft(
      validDraft({ officialPrefix: '', officialIndividual: '' }),
    )

    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Ingresá al menos una identificación completa.')
  })

  it('rechaza una identificación oficial parcial', () => {
    const result = validateAnimalDraft(
      validDraft({ officialIndividual: '' }),
    )

    expect(result.valid).toBe(false)
    expect(result.errors).toContain(
      'Completá prefijo e identificación individual oficial.',
    )
  })

  it('rechaza una caravana de color parcial', () => {
    const result = validateAnimalDraft(
      validDraft({
        officialPrefix: '',
        officialIndividual: '',
        tagColor: 'Celeste',
      }),
    )

    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Completá color y número de caravana.')
  })

  it('exige diagnóstico', () => {
    const result = validateAnimalDraft(validDraft({ diagnosis: '' }))

    expect(result.errors).toContain('Seleccioná un diagnóstico.')
  })

  it('exige boqueo', () => {
    const result = validateAnimalDraft(validDraft({ dentition: '' }))

    expect(result.errors).toContain('Seleccioná un boqueo.')
  })

  it('exige condición corporal', () => {
    const result = validateAnimalDraft(validDraft({ bodyCondition: null }))

    expect(result.errors).toContain('Seleccioná una condición corporal.')
  })

  it('normaliza identificadores quitando espacios y usando mayúsculas', () => {
    const result = validateAnimalDraft(
      validDraft({
        officialPrefix: ' ai 892 ',
        officialIndividual: ' pu 50 ',
      }),
    )

    expect(result.valid).toBe(true)
    expect(result.data?.officialPrefix).toBe('AI892')
    expect(result.data?.officialIndividual).toBe('PU50')
  })

  it('rechaza una caravana cuyo número no sea estrictamente numérico', () => {
    const result = validateAnimalDraft(
      validDraft({
        officialPrefix: '',
        officialIndividual: '',
        tagColor: 'Amarilla',
        tagNumber: '12A',
      }),
    )

    expect(result.errors).toContain(
      'El número de caravana debe contener solamente números.',
    )
  })
})
