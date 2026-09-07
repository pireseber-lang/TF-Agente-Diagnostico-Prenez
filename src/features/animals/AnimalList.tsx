import type { Animal } from '../../domain/models'

interface AnimalListProps {
  animals: Animal[]
}

function displayIdentification(animal: Animal): string {
  const identifications: string[] = []
  if (animal.officialPrefix && animal.officialIndividual) {
    identifications.push(
      `${animal.officialPrefix} ${animal.officialIndividual}`,
    )
  }
  if (animal.tagColor && animal.tagNumber) {
    identifications.push(`${animal.tagColor} ${animal.tagNumber}`)
  }
  return identifications.join(' · ')
}

function displayBodyCondition(value: number): string {
  return String(value).replace('.', ',')
}

export function AnimalList({ animals }: AnimalListProps) {
  return (
    <section className="animal-list-section">
      <div className="list-heading">
        <div>
          <span className="eyebrow">Jornada actual</span>
          <h2>Animales cargados: {animals.length}</h2>
        </div>
        <span className="local-badge">Guardado local</span>
      </div>

      {animals.length === 0 ? (
        <p className="empty-list">Todavía no cargaste animales.</p>
      ) : (
        <ol className="animal-list">
          {animals.map((animal) => (
            <li className="animal-card" key={animal.id}>
              <span className="animal-sequence">{animal.sequence}</span>
              <div className="animal-main">
                <strong>{displayIdentification(animal)}</strong>
                <span>{animal.diagnosis}</span>
              </div>
              <div className="animal-details">
                <span>{animal.dentition}</span>
                <span>CC {displayBodyCondition(animal.bodyCondition)}</span>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
