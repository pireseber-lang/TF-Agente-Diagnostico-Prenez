import { useState, type FormEvent } from 'react'
import { PLACES, type Place } from '../../domain/catalogs'
import { todayAsIsoDate } from '../../domain/normalization'

interface NewJourneyFormProps {
  onCreate: (date: string, place: Place) => Promise<void>
}

export function NewJourneyForm({ onCreate }: NewJourneyFormProps) {
  const [showForm, setShowForm] = useState(false)
  const [date, setDate] = useState(todayAsIsoDate)
  const [place, setPlace] = useState<Place | ''>('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!date || !place) {
      setError('Completá la fecha y el lugar.')
      return
    }

    setSaving(true)
    setError('')
    try {
      await onCreate(date, place)
    } catch {
      setError('No se pudo guardar la jornada en este dispositivo.')
      setSaving(false)
    }
  }

  if (!showForm) {
    return (
      <section className="empty-state card">
        <span className="eyebrow">Primera carga</span>
        <h2>Iniciá una jornada</h2>
        <p>La fecha, el lugar y cada animal se guardarán en este dispositivo.</p>
        <button
          className="primary-button"
          onClick={() => setShowForm(true)}
          type="button"
        >
          Nueva jornada
        </button>
      </section>
    )
  }

  return (
    <form className="card form-card" onSubmit={handleSubmit}>
      <div>
        <span className="eyebrow">Nueva jornada</span>
        <h2>¿Dónde trabajamos hoy?</h2>
      </div>

      {error && <p className="error-banner">{error}</p>}

      <label className="field-label">
        Fecha
        <input
          required
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />
      </label>

      <label className="field-label">
        Lugar
        <select
          required
          value={place}
          onChange={(event) => setPlace(event.target.value as Place | '')}
        >
          <option value="">Seleccionar lugar</option>
          {PLACES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <button className="primary-button" disabled={saving} type="submit">
        {saving ? 'Guardando…' : 'Crear jornada'}
      </button>
    </form>
  )
}
