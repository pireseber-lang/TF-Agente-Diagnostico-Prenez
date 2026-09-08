import { useState } from 'react'
import { formatAnimalIdentification } from '../../domain/animalIdentification'
import { filterAnimalsBySearch } from '../../domain/animalSearch'
import type { Animal } from '../../domain/models'

interface AnimalListProps {
  animals: Animal[]
  deletingAnimalId?: string
  onEdit?: (animal: Animal) => void
  onDelete?: (animal: Animal) => void
  onBack: () => void
  backLabel?: string
  readOnly?: boolean
}

function displayBodyCondition(value: number): string {
  return String(value).replace('.', ',')
}

export function AnimalList({
  animals,
  deletingAnimalId,
  onEdit,
  onDelete,
  onBack,
  backLabel = 'Volver a carga',
  readOnly = false,
}: AnimalListProps) {
  const [query, setQuery] = useState('')
  const filteredAnimals = filterAnimalsBySearch(animals, query)
  const hasSearch = query.trim().length > 0

  return (
    <section className="animal-list-section">
      <div className="list-heading">
        <div>
          <span className="eyebrow">Jornada actual</span>
          <h2>Animales cargados</h2>
          <span className="list-total">Total: {animals.length}</span>
        </div>
        <button
          className="secondary-button compact-button"
          onClick={onBack}
          type="button"
        >
          {backLabel}
        </button>
      </div>

      <div className="search-card">
        <label className="field-label" htmlFor="animal-search">
          Buscar animales
          <input
            autoComplete="off"
            id="animal-search"
            placeholder="Ej.: AI892 PU50 o Verde 1342"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        {hasSearch && animals.length > 0 && (
          <span className="search-result-count" aria-live="polite">
            Coincidencias: {filteredAnimals.length} de {animals.length}
          </span>
        )}
      </div>

      {animals.length === 0 ? (
        <p className="empty-list">Todavía no cargaste animales.</p>
      ) : filteredAnimals.length === 0 ? (
        <p className="empty-list" role="status">
          No se encontraron animales para “{query}”.
        </p>
      ) : (
        <ol className="animal-list">
          {filteredAnimals.map((animal) => (
            <li className="animal-card" key={animal.id}>
              <span className="animal-sequence">{animal.sequence}</span>
              <div className="animal-main">
                <strong>{formatAnimalIdentification(animal)}</strong>
                <span>{animal.diagnosis}</span>
              </div>
              <div className="animal-details">
                <span>{animal.dentition}</span>
                <span>CC {displayBodyCondition(animal.bodyCondition)}</span>
              </div>
              {!readOnly && onEdit && onDelete && (
                <div className="animal-actions">
                  <button
                    className="secondary-button compact-button"
                    onClick={() => onEdit(animal)}
                    type="button"
                  >
                    Editar
                  </button>
                  <button
                    className="danger-button compact-button"
                    disabled={deletingAnimalId === animal.id}
                    onClick={() => onDelete(animal)}
                    type="button"
                  >
                    {deletingAnimalId === animal.id ? 'Eliminando…' : 'Eliminar'}
                  </button>
                </div>
              )}
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
