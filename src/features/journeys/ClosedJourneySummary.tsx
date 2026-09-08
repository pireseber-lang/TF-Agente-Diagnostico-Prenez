import {
  calculateJourneyStatistics,
  formatPercentage,
} from '../../domain/journeyStatistics'
import type { Animal, Journey } from '../../domain/models'
import { formatLocalDate } from '../../domain/normalization'

interface ClosedJourneySummaryProps {
  journey: Journey
  animals: Animal[]
  onViewAnimals: () => void
  onNewJourney?: () => void
  consulted?: boolean
}

function Metric({ count, percentage }: { count: number; percentage: number }) {
  return (
    <span className="metric-value">
      {count} — {formatPercentage(percentage)}
    </span>
  )
}

export function ClosedJourneySummary({
  journey,
  animals,
  onViewAnimals,
  onNewJourney,
  consulted = false,
}: ClosedJourneySummaryProps) {
  const statistics = calculateJourneyStatistics(animals)

  return (
    <section className="closed-summary">
      <div className="closed-heading card">
        <span className="eyebrow">
          {consulted
            ? `Jornada consultada · ${journey.status === 'open' ? 'Abierta' : 'Cerrada'}`
            : journey.status === 'closed'
              ? 'Jornada finalizada'
              : 'Jornada abierta'}
        </span>
        <h2>{journey.place}</h2>
        <time dateTime={journey.date}>{formatLocalDate(journey.date)}</time>
        <strong>Total de vacas: {statistics.totalAnimals}</strong>
      </div>

      <section className="statistics-card card">
        <h2>Resumen reproductivo</h2>
        <dl className="statistics-list">
          <div>
            <dt>Preñadas</dt>
            <dd><Metric {...statistics.pregnant} /></dd>
          </div>
          <div>
            <dt>Vacías</dt>
            <dd><Metric {...statistics.empty} /></dd>
          </div>
        </dl>

        <h3>Distribución de preñadas</h3>
        <p className="statistics-note">
          Los porcentajes de esta sección se calculan sobre el total de vacas
          preñadas.
        </p>
        <dl className="statistics-list">
          {Object.entries(statistics.pregnantBreakdown).map(
            ([diagnosis, metric]) => (
              <div key={diagnosis}>
                <dt>{diagnosis.replace('Preñada ', '')}</dt>
                <dd><Metric {...metric} /></dd>
              </div>
            ),
          )}
        </dl>
      </section>

      <section className="statistics-card card">
        <h2>Boqueo / vacas viejas</h2>
        <dl className="statistics-list">
          <div>
            <dt>Sin Diente</dt>
            <dd><Metric {...statistics.oldCows.noTeeth} /></dd>
          </div>
          <div>
            <dt>Diente Cuarto</dt>
            <dd><Metric {...statistics.oldCows.quarterTooth} /></dd>
          </div>
        </dl>
        <div className="operational-notes">
          <p>
            <strong>Sin Diente:</strong> candidatas a salida actual del rodeo
            por edad.
          </p>
          <p>
            <strong>Diente Cuarto:</strong> a seguir especialmente; candidatas
            a salida el año siguiente.
          </p>
          <p>
            El sistema solo informa estas categorías y no decide descartes.
          </p>
        </div>
      </section>

      <div className="closed-summary-actions">
        <button
          className="primary-button view-animals-button"
          onClick={onViewAnimals}
          type="button"
        >
          Ver animales cargados
        </button>
        {onNewJourney && (
          <button
            className="secondary-button new-journey-button"
            onClick={onNewJourney}
            type="button"
          >
            Nueva jornada
          </button>
        )}
      </div>
    </section>
  )
}
