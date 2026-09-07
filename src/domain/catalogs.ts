export const PLACES = [
  'Manga Casco',
  'Manga Complejo',
  'Manga Oro Monte',
] as const

export const TAG_COLORS = [
  'Verde',
  'Rojo',
  'Blanco',
  'Violeta',
  'Celeste',
  'Naranja',
  'Amarilla',
] as const

export const DIAGNOSES = [
  'Preñada Cabeza',
  'Preñada Cuerpo',
  'Preñada Cola',
  'Preñada Robo',
  'Vacía',
] as const

export const DENTITIONS = [
  'Diente lleno',
  'Diente medio',
  'Diente cuarto',
  'Sin Diente',
] as const

export const BODY_CONDITIONS = [
  2, 2.25, 2.5, 2.75, 3, 3.25, 3.5, 3.75, 4, 4.25, 4.5,
] as const

export type Place = (typeof PLACES)[number]
export type TagColor = (typeof TAG_COLORS)[number]
export type Diagnosis = (typeof DIAGNOSES)[number]
export type Dentition = (typeof DENTITIONS)[number]
export type BodyCondition = (typeof BODY_CONDITIONS)[number]
