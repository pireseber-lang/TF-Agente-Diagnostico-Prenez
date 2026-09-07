import { useEffect, useState, type FormEvent } from 'react'
import { ChoiceGroup } from '../../components/ChoiceGroup'
import {
  BODY_CONDITIONS,
  DENTITIONS,
  DIAGNOSES,
  TAG_COLORS,
  type BodyCondition,
  type Dentition,
  type Diagnosis,
  type TagColor,
} from '../../domain/catalogs'
import { formatAnimalIdentification } from '../../domain/animalIdentification'
import type {
  Animal,
  AnimalDraft,
  ValidatedAnimalData,
} from '../../domain/models'
import { validateAnimalDraft } from '../../domain/validation/animalValidation'

interface AnimalFormProps {
  onSave: (animal: ValidatedAnimalData) => Promise<void>
  editingAnimal?: Animal
  onCancelEdit: () => void
}

function emptyDraft(): AnimalDraft {
  return {
    officialPrefix: '',
    officialIndividual: '',
    tagColor: '',
    tagNumber: '',
    diagnosis: '',
    dentition: '',
    bodyCondition: null,
    observations: '',
  }
}

function displayBodyCondition(value: BodyCondition): string {
  return String(value).replace('.', ',')
}

function draftFromAnimal(animal: Animal): AnimalDraft {
  return {
    officialPrefix: animal.officialPrefix ?? '',
    officialIndividual: animal.officialIndividual ?? '',
    tagColor: animal.tagColor ?? '',
    tagNumber: animal.tagNumber ?? '',
    diagnosis: animal.diagnosis,
    dentition: animal.dentition,
    bodyCondition: animal.bodyCondition,
    observations: animal.observations,
  }
}

export function AnimalForm({
  onSave,
  editingAnimal,
  onCancelEdit,
}: AnimalFormProps) {
  const [draft, setDraft] = useState<AnimalDraft>(emptyDraft)
  const [errors, setErrors] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setDraft(editingAnimal ? draftFromAnimal(editingAnimal) : emptyDraft())
    setErrors([])
  }, [editingAnimal])

  function updateDraft<Key extends keyof AnimalDraft>(
    key: Key,
    value: AnimalDraft[Key],
  ) {
    setDraft((current) => ({ ...current, [key]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const validation = validateAnimalDraft(draft)
    if (!validation.valid || !validation.data) {
      setErrors(validation.errors)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setSaving(true)
    setErrors([])
    try {
      await onSave(validation.data)
      setDraft(emptyDraft())
    } catch {
      setErrors(['No se pudo guardar el animal en este dispositivo.'])
    } finally {
      setSaving(false)
    }
  }

  function handleCancelEdit() {
    setDraft(emptyDraft())
    setErrors([])
    onCancelEdit()
  }

  return (
    <form className="animal-form" id="animal-form" onSubmit={handleSubmit}>
      {editingAnimal && (
        <section className="editing-banner" aria-live="polite">
          <div>
            <span className="eyebrow">Modo edición</span>
            <strong>
              Editando animal {editingAnimal.sequence}: {' '}
              {formatAnimalIdentification(editingAnimal)}
            </strong>
          </div>
          <span>El registro conservará su ID interno.</span>
        </section>
      )}

      {errors.length > 0 && (
        <section className="error-banner" aria-live="assertive">
          <strong>Revisá estos datos:</strong>
          <ul>
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="card form-section">
        <div className="section-heading">
          <span className="section-number">1</span>
          <div>
            <h2>Identificación</h2>
            <p>Completá al menos una identificación.</p>
          </div>
        </div>

        <h3>Identificación oficial</h3>
        <div className="two-column-grid">
          <label className="field-label">
            Prefijo
            <input
              autoCapitalize="characters"
              autoComplete="off"
              placeholder="AI892"
              value={draft.officialPrefix}
              onChange={(event) =>
                updateDraft('officialPrefix', event.target.value)
              }
            />
          </label>
          <label className="field-label">
            Individual
            <input
              autoCapitalize="characters"
              autoComplete="off"
              placeholder="PU50"
              value={draft.officialIndividual}
              onChange={(event) =>
                updateDraft('officialIndividual', event.target.value)
              }
            />
          </label>
        </div>

        <h3>Caravana de color</h3>
        <div className="two-column-grid">
          <label className="field-label">
            Color
            <select
              value={draft.tagColor}
              onChange={(event) =>
                updateDraft('tagColor', event.target.value as TagColor | '')
              }
            >
              <option value="">Seleccionar</option>
              {TAG_COLORS.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>
          </label>
          <label className="field-label">
            Número
            <input
              autoComplete="off"
              inputMode="numeric"
              pattern="[0-9 ]*"
              placeholder="1342"
              value={draft.tagNumber}
              onChange={(event) => updateDraft('tagNumber', event.target.value)}
            />
          </label>
        </div>
      </section>

      <section className="card form-section">
        <div className="section-heading">
          <span className="section-number">2</span>
          <h2>Diagnóstico</h2>
        </div>
        <ChoiceGroup
          legend="Seleccioná el diagnóstico informado por el veterinario"
          options={DIAGNOSES}
          selected={draft.diagnosis}
          onSelect={(diagnosis: Diagnosis) =>
            updateDraft('diagnosis', diagnosis)
          }
        />
      </section>

      <section className="card form-section">
        <div className="section-heading">
          <span className="section-number">3</span>
          <h2>Boqueo</h2>
        </div>
        <ChoiceGroup
          legend="Seleccioná el boqueo"
          options={DENTITIONS}
          selected={draft.dentition}
          onSelect={(dentition: Dentition) =>
            updateDraft('dentition', dentition)
          }
        />
      </section>

      <section className="card form-section">
        <div className="section-heading">
          <span className="section-number">4</span>
          <h2>Condición corporal</h2>
        </div>
        <ChoiceGroup
          compact
          legend="Seleccioná la condición corporal"
          options={BODY_CONDITIONS}
          selected={draft.bodyCondition}
          formatOption={displayBodyCondition}
          onSelect={(condition: BodyCondition) =>
            updateDraft('bodyCondition', condition)
          }
        />
      </section>

      <section className="card form-section">
        <div className="section-heading">
          <span className="section-number">5</span>
          <h2>Observaciones</h2>
        </div>
        <label className="field-label">
          Texto opcional
          <textarea
            placeholder="Agregar una observación…"
            rows={3}
            value={draft.observations}
            onChange={(event) =>
              updateDraft('observations', event.target.value)
            }
          />
        </label>
      </section>

      <div className="save-bar">
        {editingAnimal && (
          <button
            className="secondary-button"
            disabled={saving}
            onClick={handleCancelEdit}
            type="button"
          >
            Cancelar edición
          </button>
        )}
        <button className="primary-button" disabled={saving} type="submit">
          {saving
            ? 'Guardando…'
            : editingAnimal
              ? 'Guardar cambios'
              : 'Guardar y siguiente'}
        </button>
      </div>
    </form>
  )
}
