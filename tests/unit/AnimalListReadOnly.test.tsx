import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import type { Animal } from '../../src/domain/models'
import { AnimalList } from '../../src/features/animals/AnimalList'

const historicalAnimal: Animal = {
  id: 'animal-1',
  journeyId: 'journey-historical',
  sequence: 1,
  officialPrefix: 'AI892',
  officialIndividual: 'PU50',
  diagnosis: 'Preñada Cabeza',
  dentition: 'Diente cuarto',
  bodyCondition: 3.25,
  observations: '',
  createdAt: '2026-09-07T10:00:00.000Z',
}

describe('AnimalList en consulta histórica', () => {
  it('muestra los datos y no ofrece editar ni eliminar en modo solo lectura', () => {
    const html = renderToStaticMarkup(
      <AnimalList
        animals={[historicalAnimal]}
        contextLabel="Jornada consultada"
        onBack={() => {}}
        readOnly
      />,
    )

    expect(html).toContain('Jornada consultada')
    expect(html).toContain('AI892 PU50')
    expect(html).toContain('Preñada Cabeza')
    expect(html).toContain('Diente cuarto')
    expect(html).toContain('CC 3,25')
    expect(html).not.toContain('Editar')
    expect(html).not.toContain('Eliminar')
    expect(html).not.toContain('Guardar')
  })
})
