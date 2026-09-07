import type {
  BodyCondition,
  Dentition,
  Diagnosis,
  Place,
  TagColor,
} from './catalogs'

export interface Journey {
  id: string
  date: string
  place: Place
  status: 'open'
  createdAt: string
}

export interface Animal {
  id: string
  journeyId: string
  sequence: number
  officialPrefix?: string
  officialIndividual?: string
  tagColor?: TagColor
  tagNumber?: string
  diagnosis: Diagnosis
  dentition: Dentition
  bodyCondition: BodyCondition
  observations: string
  createdAt: string
}

export interface AnimalDraft {
  officialPrefix: string
  officialIndividual: string
  tagColor: TagColor | ''
  tagNumber: string
  diagnosis: Diagnosis | ''
  dentition: Dentition | ''
  bodyCondition: BodyCondition | null
  observations: string
}

export interface ValidatedAnimalData {
  officialPrefix?: string
  officialIndividual?: string
  tagColor?: TagColor
  tagNumber?: string
  diagnosis: Diagnosis
  dentition: Dentition
  bodyCondition: BodyCondition
  observations: string
}
