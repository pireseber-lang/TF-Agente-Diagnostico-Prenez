import { useEffect, useReducer, useState } from 'react'
import type { Place } from '../domain/catalogs'
import { formatAnimalIdentification } from '../domain/animalIdentification'
import {
  createDuplicateReviewEvidence,
  findDuplicateMatches,
} from '../domain/duplicateDetection'
import type {
  Animal,
  Journey,
  JourneyHistoryItem,
  ValidatedAnimalData,
} from '../domain/models'
import { formatLocalDate } from '../domain/normalization'
import { AnimalForm } from '../features/animals/AnimalForm'
import { AnimalList } from '../features/animals/AnimalList'
import {
  animalWorkspaceReducer,
  initialAnimalWorkspaceState,
} from '../features/animals/animalWorkspace'
import { CloseJourneyReview } from '../features/journeys/CloseJourneyReview'
import { ClosedJourneySummary } from '../features/journeys/ClosedJourneySummary'
import { JourneyHistory } from '../features/journeys/JourneyHistory'
import { NewJourneyForm } from '../features/journeys/NewJourneyForm'
import {
  addAnimal,
  deleteAnimal,
  listAnimalsByJourney,
  updateAnimal,
} from '../infrastructure/db/repositories/animalRepository'
import {
  closeJourney,
  createJourney,
  getCurrentJourney,
  listJourneyHistory,
} from '../infrastructure/db/repositories/journeyRepository'

type AppView =
  | 'current'
  | 'history'
  | 'historical-summary'
  | 'historical-animals'

export function App() {
  const [journey, setJourney] = useState<Journey>()
  const [workspace, dispatch] = useReducer(
    animalWorkspaceReducer,
    initialAnimalWorkspaceState,
  )
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [operationError, setOperationError] = useState('')
  const [deletingAnimalId, setDeletingAnimalId] = useState<string>()
  const [appView, setAppView] = useState<AppView>('current')
  const [historyItems, setHistoryItems] = useState<JourneyHistoryItem[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [consultedJourney, setConsultedJourney] = useState<Journey>()
  const [consultedAnimals, setConsultedAnimals] = useState<Animal[]>([])

  const editingAnimal = workspace.animals.find(
    (animal) => animal.id === workspace.editingAnimalId,
  )

  useEffect(() => {
    let active = true

    async function loadPersistedData() {
      try {
        const persistedJourney = await getCurrentJourney()
        if (!active || !persistedJourney) return
        const persistedAnimals = await listAnimalsByJourney(
          persistedJourney.id,
        )
        if (active) {
          setJourney(persistedJourney)
          dispatch({ type: 'animalsLoaded', animals: persistedAnimals })
        }
      } catch {
        if (active) {
          setLoadError('No se pudieron leer los datos guardados en el dispositivo.')
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    void loadPersistedData()
    return () => {
      active = false
    }
  }, [])

  async function handleCreateJourney(date: string, place: Place) {
    const createdJourney = await createJourney(date, place)
    setJourney(createdJourney)
    dispatch({ type: 'animalsLoaded', animals: [] })
  }

  async function handleSaveAnimal(
    data: ValidatedAnimalData,
  ): Promise<boolean> {
    if (!journey || journey.status === 'closed') return false
    const matches = findDuplicateMatches(data, workspace.animals)
    if (matches.length > 0) {
      dispatch({
        type: 'duplicateReviewRequested',
        review: { data, matches },
      })
      return false
    }

    const createdAnimal = await addAnimal(journey.id, data)
    dispatch({ type: 'animalCreated', animal: createdAnimal })
    return true
  }

  async function handleUpdateAnimal(
    data: ValidatedAnimalData,
  ): Promise<boolean> {
    if (!editingAnimal) return false
    const matches = findDuplicateMatches(
      data,
      workspace.animals,
      editingAnimal.id,
    )
    if (matches.length > 0) {
      dispatch({
        type: 'duplicateReviewRequested',
        review: { data, matches, editingAnimalId: editingAnimal.id },
      })
      return false
    }

    const updatedAnimal = await updateAnimal(editingAnimal.id, data)
    dispatch({ type: 'animalUpdated', animal: updatedAnimal })
    return true
  }

  async function handleConfirmDuplicateReview() {
    const review = workspace.pendingDuplicateReview
    if (!review || !journey) return

    const evidence = createDuplicateReviewEvidence(review.matches)
    if (review.editingAnimalId) {
      const updatedAnimal = await updateAnimal(
        review.editingAnimalId,
        review.data,
        evidence,
      )
      dispatch({ type: 'animalUpdated', animal: updatedAnimal })
      return
    }

    const createdAnimal = await addAnimal(journey.id, review.data, evidence)
    dispatch({ type: 'animalCreated', animal: createdAnimal })
  }

  function handleCancelDuplicateReview() {
    dispatch({ type: 'duplicateReviewCanceled' })
  }

  function handleEditAnimal(animal: Animal) {
    setOperationError('')
    dispatch({ type: 'editingStarted', animalId: animal.id })
    window.requestAnimationFrame(() => {
      document
        .getElementById('animal-form')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  function handleCancelEdit() {
    dispatch({ type: 'editingCanceled' })
  }

  function handleShowAnimals() {
    setOperationError('')
    dispatch({ type: 'animalsShown' })
  }

  function handleShowEntry() {
    setOperationError('')
    dispatch({ type: 'entryShown' })
  }

  function handleStartNewJourney() {
    setOperationError('')
    dispatch({ type: 'newJourneyStarted' })
  }

  function handleCancelNewJourney() {
    setOperationError('')
    dispatch({ type: 'newJourneyCanceled' })
  }

  async function handleShowHistory() {
    setOperationError('')
    setAppView('history')
    setHistoryLoading(true)
    try {
      setHistoryItems(await listJourneyHistory())
    } catch {
      setOperationError(
        'No se pudo leer el historial guardado en este dispositivo.',
      )
    } finally {
      setHistoryLoading(false)
    }
  }

  function handleShowCurrentJourney() {
    setOperationError('')
    setAppView('current')
    setConsultedJourney(undefined)
    setConsultedAnimals([])
  }

  async function handleSelectHistoricalJourney(item: JourneyHistoryItem) {
    setOperationError('')
    setHistoryLoading(true)
    try {
      const animals = await listAnimalsByJourney(item.journey.id)
      setConsultedJourney(item.journey)
      setConsultedAnimals(animals)
      setAppView('historical-summary')
    } catch {
      setOperationError(
        'No se pudo leer la jornada seleccionada en este dispositivo.',
      )
    } finally {
      setHistoryLoading(false)
    }
  }

  function handleBackToHistory() {
    setOperationError('')
    setAppView('history')
  }

  function handleShowHistoricalAnimals() {
    setOperationError('')
    setAppView('historical-animals')
  }

  function handleShowHistoricalSummary() {
    setOperationError('')
    setAppView('historical-summary')
  }

  function handleStartClosing() {
    setOperationError('')
    if (workspace.animals.length === 0) {
      setOperationError('No se puede cerrar una jornada sin animales.')
      return
    }

    dispatch({ type: 'closingStarted' })
  }

  function handleCancelClosing() {
    setOperationError('')
    dispatch({ type: 'closingCanceled' })
  }

  async function handleCloseJourney() {
    if (!journey) return
    setOperationError('')
    try {
      const closedJourney = await closeJourney(journey.id)
      setJourney(closedJourney)
      dispatch({ type: 'journeyClosed' })
    } catch {
      setOperationError(
        'No se pudo cerrar la jornada. Revisá los datos e intentá nuevamente.',
      )
    }
  }

  async function handleDeleteAnimal(animal: Animal) {
    const identification = formatAnimalIdentification(animal)
    const confirmed = window.confirm(
      `¿Eliminar el animal ${animal.sequence}: ${identification}?\n\nEsta acción no se puede deshacer.`,
    )

    if (!confirmed) return

    setDeletingAnimalId(animal.id)
    setOperationError('')
    try {
      await deleteAnimal(animal.id)
      dispatch({ type: 'animalDeleted', animalId: animal.id })
    } catch {
      setOperationError(
        `No se pudo eliminar el animal ${identification} del dispositivo.`,
      )
    } finally {
      setDeletingAnimalId(undefined)
    }
  }

  if (loading) {
    return <main className="app-shell loading-state">Cargando datos locales…</main>
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="brand-mark" aria-hidden="true">
          DP
        </div>
        <div>
          <span className="eyebrow">Trabajo en manga</span>
          <h1>Diagnóstico de preñez</h1>
        </div>
      </header>

      <nav className="app-navigation" aria-label="Navegación principal">
        {appView === 'current' ? (
          <button
            className="secondary-button"
            onClick={() => void handleShowHistory()}
            type="button"
          >
            Historial de jornadas
          </button>
        ) : (
          <button
            className="secondary-button"
            onClick={handleShowCurrentJourney}
            type="button"
          >
            Volver a jornada actual
          </button>
        )}
      </nav>

      {loadError && <p className="error-banner">{loadError}</p>}
      {operationError && <p className="error-banner">{operationError}</p>}

      {appView === 'history' ? (
        <JourneyHistory
          items={historyItems}
          loading={historyLoading}
          onSelect={(item) => void handleSelectHistoricalJourney(item)}
        />
      ) : appView === 'historical-summary' && consultedJourney ? (
        <>
          <button
            className="secondary-button history-back-button"
            onClick={handleBackToHistory}
            type="button"
          >
            Volver al historial
          </button>
          <ClosedJourneySummary
            animals={consultedAnimals}
            consulted
            journey={consultedJourney}
            onViewAnimals={handleShowHistoricalAnimals}
          />
        </>
      ) : appView === 'historical-animals' && consultedJourney ? (
        <AnimalList
          animals={consultedAnimals}
          backLabel="Volver al resumen"
          contextLabel="Jornada consultada"
          onBack={handleShowHistoricalSummary}
          readOnly
        />
      ) : !journey ? (
        <NewJourneyForm onCreate={handleCreateJourney} />
      ) : (
        <>
          {workspace.screen !== 'new-journey' && (
            <section className="journey-summary card">
              <div>
                <span className="eyebrow">
                  Jornada {journey.status === 'closed' ? 'cerrada' : 'abierta'}
                </span>
                <h2>{journey.place}</h2>
              </div>
              <time dateTime={journey.date}>{formatLocalDate(journey.date)}</time>
            </section>
          )}

          {journey.status === 'closed' &&
          workspace.screen === 'new-journey' ? (
            <NewJourneyForm
              initiallyOpen
              onCancel={handleCancelNewJourney}
              onCreate={handleCreateJourney}
            />
          ) : journey.status === 'closed' && workspace.screen === 'animals' ? (
            <AnimalList
              animals={workspace.animals}
              backLabel="Volver al resumen"
              onBack={handleShowEntry}
              readOnly
            />
          ) : journey.status === 'closed' ? (
            <ClosedJourneySummary
              animals={workspace.animals}
              journey={journey}
              onNewJourney={handleStartNewJourney}
              onViewAnimals={handleShowAnimals}
            />
          ) : workspace.screen === 'closing' ? (
            <CloseJourneyReview
              animals={workspace.animals}
              journey={journey}
              onCancel={handleCancelClosing}
              onConfirm={handleCloseJourney}
            />
          ) : workspace.screen === 'animals' ? (
            <AnimalList
              animals={workspace.animals}
              deletingAnimalId={deletingAnimalId}
              onBack={handleShowEntry}
              onDelete={handleDeleteAnimal}
              onEdit={handleEditAnimal}
            />
          ) : (
            <>
              <section className="load-overview card">
                <div>
                  <span className="eyebrow">Carga de la jornada</span>
                  <h2>Animales cargados: {workspace.animals.length}</h2>
                  <p>El listado completo se consulta en una pantalla separada.</p>
                </div>
                <button
                  className="primary-button view-animals-button"
                  disabled={Boolean(editingAnimal)}
                  onClick={handleShowAnimals}
                  type="button"
                >
                  Ver animales cargados
                </button>
                {editingAnimal && (
                  <small className="editing-navigation-hint">
                    Guardá o cancelá la edición para volver al listado.
                  </small>
                )}
                {!editingAnimal && (
                  <button
                    className="secondary-button close-journey-button"
                    onClick={handleStartClosing}
                    type="button"
                  >
                    Cerrar jornada
                  </button>
                )}
              </section>
              <AnimalForm
                duplicateMatches={
                  workspace.pendingDuplicateReview?.matches
                }
                editingAnimal={editingAnimal}
                onCancelEdit={handleCancelEdit}
                onCancelDuplicateReview={handleCancelDuplicateReview}
                onConfirmDuplicateReview={handleConfirmDuplicateReview}
                onSave={editingAnimal ? handleUpdateAnimal : handleSaveAnimal}
              />
            </>
          )}
        </>
      )}
    </main>
  )
}
