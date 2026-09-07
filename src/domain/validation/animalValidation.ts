import {
  BODY_CONDITIONS,
  DENTITIONS,
  DIAGNOSES,
  TAG_COLORS,
} from '../catalogs'
import type { AnimalDraft, ValidatedAnimalData } from '../models'
import { normalizeIdentifier } from '../normalization'

export interface AnimalValidationResult {
  valid: boolean
  errors: string[]
  data?: ValidatedAnimalData
}

const alphanumericPattern = /^[A-Z0-9]+$/
const numericPattern = /^\d+$/

export function validateAnimalDraft(
  draft: AnimalDraft,
): AnimalValidationResult {
  const errors: string[] = []
  const officialPrefix = normalizeIdentifier(draft.officialPrefix)
  const officialIndividual = normalizeIdentifier(draft.officialIndividual)
  const tagNumber = normalizeIdentifier(draft.tagNumber)

  const officialStarted = Boolean(officialPrefix || officialIndividual)
  const officialComplete = Boolean(officialPrefix && officialIndividual)
  const tagStarted = Boolean(draft.tagColor || tagNumber)
  const tagComplete = Boolean(draft.tagColor && tagNumber)

  if (officialStarted && !officialComplete) {
    errors.push('Completá prefijo e identificación individual oficial.')
  }

  if (officialPrefix && !alphanumericPattern.test(officialPrefix)) {
    errors.push('El prefijo oficial debe ser alfanumérico.')
  }

  if (officialIndividual && !alphanumericPattern.test(officialIndividual)) {
    errors.push('La identificación individual oficial debe ser alfanumérica.')
  }

  if (tagStarted && !tagComplete) {
    errors.push('Completá color y número de caravana.')
  }

  if (tagNumber && !numericPattern.test(tagNumber)) {
    errors.push('El número de caravana debe contener solamente números.')
  }

  if (!officialComplete && !tagComplete) {
    errors.push('Ingresá al menos una identificación completa.')
  }

  if (!draft.diagnosis || !DIAGNOSES.includes(draft.diagnosis)) {
    errors.push('Seleccioná un diagnóstico.')
  }

  if (!draft.dentition || !DENTITIONS.includes(draft.dentition)) {
    errors.push('Seleccioná un boqueo.')
  }

  if (
    draft.bodyCondition === null ||
    !BODY_CONDITIONS.includes(draft.bodyCondition)
  ) {
    errors.push('Seleccioná una condición corporal.')
  }

  if (draft.tagColor && !TAG_COLORS.includes(draft.tagColor)) {
    errors.push('Seleccioná un color de caravana válido.')
  }

  if (errors.length > 0) {
    return { valid: false, errors }
  }

  return {
    valid: true,
    errors: [],
    data: {
      ...(officialComplete
        ? { officialPrefix, officialIndividual }
        : {}),
      ...(tagComplete
        ? { tagColor: draft.tagColor || undefined, tagNumber }
        : {}),
      diagnosis: draft.diagnosis as ValidatedAnimalData['diagnosis'],
      dentition: draft.dentition as ValidatedAnimalData['dentition'],
      bodyCondition:
        draft.bodyCondition as ValidatedAnimalData['bodyCondition'],
      observations: draft.observations.trim(),
    },
  }
}
