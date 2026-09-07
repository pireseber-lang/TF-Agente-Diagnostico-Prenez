import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it } from 'vitest'
import type { ValidatedAnimalData } from '../../src/domain/models'
import { getDatabase } from '../../src/infrastructure/db/database'
import {
  addAnimal,
  deleteAnimal,
  listAnimalsByJourney,
  updateAnimal,
} from '../../src/infrastructure/db/repositories/animalRepository'

const baseData: ValidatedAnimalData = {
  officialPrefix: 'AI892',
  officialIndividual: 'PU50',
  diagnosis: 'Preñada Cabeza',
  dentition: 'Diente lleno',
  bodyCondition: 3,
  observations: '',
}

beforeEach(async () => {
  const database = await getDatabase()
  await database.clear('animals')
})

describe('animalRepository', () => {
  it('editar conserva el ID interno y no crea un animal adicional', async () => {
    const created = await addAnimal('journey-1', baseData)
    const updated = await updateAnimal(created.id, {
      ...baseData,
      diagnosis: 'Vacía',
    })
    const persisted = await listAnimalsByJourney('journey-1')

    expect(updated.id).toBe(created.id)
    expect(persisted).toHaveLength(1)
    expect(persisted[0]?.id).toBe(created.id)
  })

  it('editar actualiza los campos en IndexedDB', async () => {
    const created = await addAnimal('journey-1', baseData)
    await updateAnimal(created.id, {
      tagColor: 'Violeta',
      tagNumber: '528',
      diagnosis: 'Preñada Cola',
      dentition: 'Diente cuarto',
      bodyCondition: 3.5,
      observations: 'Dato corregido',
    })
    const [persisted] = await listAnimalsByJourney('journey-1')

    expect(persisted).toMatchObject({
      id: created.id,
      officialPrefix: undefined,
      officialIndividual: undefined,
      tagColor: 'Violeta',
      tagNumber: '528',
      diagnosis: 'Preñada Cola',
      dentition: 'Diente cuarto',
      bodyCondition: 3.5,
      observations: 'Dato corregido',
    })
  })

  it('eliminar quita el registro de IndexedDB', async () => {
    const created = await addAnimal('journey-1', baseData)
    await deleteAnimal(created.id)

    expect(await listAnimalsByJourney('journey-1')).toEqual([])
  })
})
