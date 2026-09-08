import type { JourneyHistoryItem } from '../../domain/models'
import { formatLocalDate } from '../../domain/normalization'

interface JourneyHistoryProps {
  items: JourneyHistoryItem[]
  loading: boolean
  onSelect: (item: JourneyHistoryItem) => void
}

function animalCountLabel(count: number): string {
  return `${count} ${count === 1 ? 'animal' : 'animales'}`
}

export function JourneyHistory({
  items,
  loading,
  onSelect,
}: JourneyHistoryProps) {
  return (
    <section className="history-section">
      <div className="history-heading card">
        <span className="eyebrow">Consulta local</span>
        <h2>Historial de jornadas</h2>
        <p>
          Las jornadas se consultan sin cambiar ni modificar la jornada actual.
        </p>
      </div>

      {loading ? (
        <p className="empty-list" role="status">
          Cargando historial…
        </p>
      ) : items.length === 0 ? (
        <p className="empty-list" role="status">
          No hay jornadas registradas.
        </p>
      ) : (
        <ol className="history-list">
          {items.map(({ journey, animalCount }) => (
            <li className="history-card card" key={journey.id}>
              <div className="history-card-heading">
                <div>
                  <time dateTime={journey.date}>
                    {formatLocalDate(journey.date)}
                  </time>
                  <h3>{journey.place}</h3>
                </div>
                <span
                  className={`journey-status journey-status--${journey.status}`}
                >
                  {journey.status === 'open' ? 'Abierta' : 'Cerrada'}
                </span>
              </div>
              <span className="history-animal-count">
                {animalCountLabel(animalCount)}
              </span>
              <button
                className="secondary-button"
                onClick={() => onSelect({ journey, animalCount })}
                type="button"
              >
                Ver jornada
              </button>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
