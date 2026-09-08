import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import type { JourneyHistoryItem } from '../../src/domain/models'
import { JourneyHistory } from '../../src/features/journeys/JourneyHistory'

const items: JourneyHistoryItem[] = [
  {
    journey: {
      id: 'journey-open',
      date: '2026-09-08',
      place: 'Manga Oro Monte',
      status: 'open',
      createdAt: '2026-09-08T09:00:00.000Z',
    },
    animalCount: 3,
  },
  {
    journey: {
      id: 'journey-closed',
      date: '2026-09-07',
      place: 'Manga Casco',
      status: 'closed',
      createdAt: '2026-09-07T09:00:00.000Z',
      closedAt: '2026-09-07T18:00:00.000Z',
    },
    animalCount: 10,
  },
]

describe('JourneyHistory', () => {
  it('muestra fecha, lugar, estado, cantidad y acción de cada jornada', () => {
    const html = renderToStaticMarkup(
      <JourneyHistory items={items} loading={false} onSelect={() => {}} />,
    )

    expect(html).toContain('08/09/2026')
    expect(html).toContain('Manga Oro Monte')
    expect(html).toContain('Abierta')
    expect(html).toContain('3 animales')
    expect(html).toContain('07/09/2026')
    expect(html).toContain('Manga Casco')
    expect(html).toContain('Cerrada')
    expect(html).toContain('10 animales')
    expect(html.match(/Ver jornada/g)).toHaveLength(2)
    expect(html.indexOf('08/09/2026')).toBeLessThan(
      html.indexOf('07/09/2026'),
    )
  })

  it('muestra un mensaje claro cuando no hay jornadas', () => {
    const html = renderToStaticMarkup(
      <JourneyHistory items={[]} loading={false} onSelect={() => {}} />,
    )

    expect(html).toContain('No hay jornadas registradas.')
  })
})
