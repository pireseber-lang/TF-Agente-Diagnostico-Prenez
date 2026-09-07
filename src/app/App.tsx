import { useEffect, useState } from 'react'
import type { Place } from '../domain/catalogs'
import type { Animal, Journey, ValidatedAnimalData } from '../domain/models'
import { formatLocalDate } from '../domain/normalization'
import { AnimalForm } from '../features/animals/AnimalForm'
import { AnimalList } from '../features/animals/AnimalList'
import { NewJourneyForm } from '../features/journeys/NewJourneyForm'
import {
  addAnimal,
  listAnimalsByJourney,
} from '../infrastructure/db/repositories/animalRepository'
import {
  createJourney,
  getActiveJourney,
} from '../infrastructure/db/repositories/journeyRepository'

export function App() {
  const [journey, setJourney] = useState<Journey>()
  const [animals, setAnimals] = useState<Animal[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    let active = true

    async function loadPersistedData() {
      try {
        const persistedJourney = await getActiveJourney()
        if (!active || !persistedJourney) return
        const persistedAnimals = await listAnimalsByJourney(
          persistedJourney.id,
        )
        if (active) {
          setJourney(persistedJourney)
          setAnimals(persistedAnimals)
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
    setAnimals([])
  }

  async function handleSaveAnimal(data: ValidatedAnimalData) {
    if (!journey) return
    const createdAnimal = await addAnimal(journey.id, data)
    setAnimals((current) => [...current, createdAnimal])
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

      {loadError && <p className="error-banner">{loadError}</p>}

      {!journey ? (
        <NewJourneyForm onCreate={handleCreateJourney} />
      ) : (
        <>
          <section className="journey-summary card">
            <div>
              <span className="eyebrow">Jornada abierta</span>
              <h2>{journey.place}</h2>
            </div>
            <time dateTime={journey.date}>{formatLocalDate(journey.date)}</time>
          </section>

          <AnimalList animals={animals} />
          <AnimalForm onSave={handleSaveAnimal} />
        </>
      )}
    </main>
  )
}
