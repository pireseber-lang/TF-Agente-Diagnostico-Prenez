import { useState } from 'react'
import { formatAnimalIdentification } from '../../domain/animalIdentification'
import { getDuplicateReviewedAnimals } from '../../domain/journeyStatistics'
import type { Animal, Journey } from '../../domain/models'
import { formatLocalDate } from '../../domain/normalization'

interface CloseJourneyReviewProps {
  journey: Journey
  animals: Animal[]
  onCancel: () => void
  onConfirm: () => Promise<void>
}

export function CloseJourneyReview({
  journey,
  animals,
  onCancel,
  onConfirm,
}: CloseJourneyReviewProps) {
  const [duplicateReviewConfirmed, setDuplicateReviewConfirmed] =
    useState(false)
  const [submitting, setSubmitting] = useState(false)
  const reviewedAnimals = getDuplicateReviewedAnimals(animals)
  const requiresDuplicateConfirmation = reviewedAnimals.length > 0

  async function handleConfirm() {
    setSubmitting(true)
    try {
      await onConfirm()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="closing-review card">
      <span className="eyebrow">Cierre bajo control humano</span>
      <h2>Revisión antes del cierre</h2>

      <dl className="review-details">
        <div>
          <dt>Fecha</dt>
          <dd>{formatLocalDate(journey.date)}</dd>
        </div>
        <div>
          <dt>Lugar</dt>
          <dd>{journey.place}</dd>
        </div>
        <div>
          <dt>Total de animales</dt>
          <dd>{animals.length}</dd>
        </div>
        <div>
          <dt>Registros con revisión por duplicado</dt>
          <dd>{reviewedAnimals.length}</dd>
        </div>
      </dl>

      {requiresDuplicateConfirmation && (
        <div className="closing-warning">
          <h3>Duplicados conservados con revisión humana</h3>
          <p>
            Estos registros se guardaron de todos modos después de una
            advertencia. El sistema no los corrige ni elimina automáticamente.
          </p>
          <ul className="reviewed-animal-list">
            {reviewedAnimals.map((animal) => (
              <li key={animal.id}>
                <strong>
                  {animal.sequence}. {formatAnimalIdentification(animal)}
                </strong>
                <span>{animal.diagnosis}</span>
              </li>
            ))}
          </ul>
          <label className="confirmation-check">
            <input
              checked={duplicateReviewConfirmed}
              onChange={(event) =>
                setDuplicateReviewConfirmed(event.target.checked)
              }
              type="checkbox"
            />
            <span>
              Revisé estos registros y confirmo que deseo conservarlos.
            </span>
          </label>
        </div>
      )}

      <div className="closing-explanation">
        <strong>El cierre es definitivo en esta versión.</strong>
        <p>
          La jornada quedará finalizada, los datos seguirán conservados
          localmente y el resumen se calculará desde los registros cargados.
        </p>
      </div>

      <div className="closing-actions">
        <button
          className="secondary-button"
          disabled={submitting}
          onClick={onCancel}
          type="button"
        >
          Volver a carga
        </button>
        <button
          className="danger-confirm-button"
          disabled={
            submitting ||
            (requiresDuplicateConfirmation && !duplicateReviewConfirmed)
          }
          onClick={() => void handleConfirm()}
          type="button"
        >
          {submitting ? 'Cerrando…' : 'Confirmar cierre de jornada'}
        </button>
      </div>
    </section>
  )
}
