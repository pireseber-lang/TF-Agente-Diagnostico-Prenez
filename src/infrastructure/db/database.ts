import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { Animal, Journey } from '../../domain/models'

interface PrenezDatabase extends DBSchema {
  journeys: {
    key: string
    value: Journey
    indexes: {
      'by-status': Journey['status']
      'by-created-at': string
    }
  }
  animals: {
    key: string
    value: Animal
    indexes: {
      'by-journey-id': string
      'by-journey-sequence': [string, number]
    }
  }
}

let databasePromise: Promise<IDBPDatabase<PrenezDatabase>> | undefined

export function getDatabase(): Promise<IDBPDatabase<PrenezDatabase>> {
  databasePromise ??= openDB<PrenezDatabase>('diagnostico-prenez-v1', 1, {
    upgrade(database) {
      const journeys = database.createObjectStore('journeys', {
        keyPath: 'id',
      })
      journeys.createIndex('by-status', 'status')
      journeys.createIndex('by-created-at', 'createdAt')

      const animals = database.createObjectStore('animals', {
        keyPath: 'id',
      })
      animals.createIndex('by-journey-id', 'journeyId')
      animals.createIndex('by-journey-sequence', [
        'journeyId',
        'sequence',
      ])
    },
  })

  return databasePromise
}
