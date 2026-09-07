interface ChoiceGroupProps<T extends string | number> {
  legend: string
  options: readonly T[]
  selected: T | '' | null
  onSelect: (option: T) => void
  formatOption?: (option: T) => string
  compact?: boolean
}

export function ChoiceGroup<T extends string | number>({
  legend,
  options,
  selected,
  onSelect,
  formatOption = String,
  compact = false,
}: ChoiceGroupProps<T>) {
  return (
    <fieldset className="choice-fieldset">
      <legend>{legend}</legend>
      <div className={`choice-grid${compact ? ' choice-grid--compact' : ''}`}>
        {options.map((option) => (
          <button
            className="choice-button"
            aria-pressed={selected === option}
            key={option}
            onClick={() => onSelect(option)}
            type="button"
          >
            {formatOption(option)}
          </button>
        ))}
      </div>
    </fieldset>
  )
}
