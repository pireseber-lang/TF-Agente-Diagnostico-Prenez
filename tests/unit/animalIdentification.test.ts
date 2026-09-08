import { describe, expect, it } from 'vitest'
import { formatAnimalIdentification } from '../../src/domain/animalIdentification'

describe('formatAnimalIdentification', () => {
  it('muestra solamente el color cuando no existe número', () => {
    expect(formatAnimalIdentification({ tagColor: 'Violeta' })).toBe(
      'Violeta',
    )
  })

  it('muestra color y número cuando ambos existen', () => {
    expect(
      formatAnimalIdentification({ tagColor: 'Violeta', tagNumber: '834' }),
    ).toBe('Violeta 834')
  })
})
