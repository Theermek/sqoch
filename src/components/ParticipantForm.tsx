import { MAX_AGE, MIN_AGE } from '../constants';
import { formatTicketBadge, parseAge } from '../domain/pricing';
import { ageFieldId, nameFieldId } from '../domain/validation';
import type { Participant } from '../types';

interface Props {
  participant: Participant;
  index: number;
  canRemove: boolean;
  nameError?: string;
  ageError?: string;
  onChange: (field: 'name' | 'age', value: string) => void;
  onBlurField: (field: string) => void;
  onRemove: () => void;
}

export function ParticipantForm({
  participant,
  index,
  canRemove,
  nameError,
  ageError,
  onChange,
  onBlurField,
  onRemove,
}: Props) {
  const nameId = nameFieldId(participant.id);
  const ageId = ageFieldId(participant.id);
  const age = parseAge(participant.age);
  const showBadge = age !== null && age >= MIN_AGE && age <= MAX_AGE;

  return (
    <li className="participant">
      <div className="participant__head">
        <h3 className="participant__title">Участник {index + 1}</h3>
        {canRemove && (
          <button type="button" className="btn btn--link" onClick={onRemove}>
            Удалить
          </button>
        )}
      </div>

      <div className="field">
        <label htmlFor={nameId}>Имя</label>
        <input
          id={nameId}
          type="text"
          value={participant.name}
          autoComplete="off"
          aria-invalid={nameError ? true : undefined}
          aria-describedby={nameError ? `${nameId}-error` : undefined}
          onChange={(event) => onChange('name', event.target.value)}
          onBlur={() => onBlurField(nameId)}
        />
        {nameError && (
          <p className="field__error" id={`${nameId}-error`}>
            {nameError}
          </p>
        )}
      </div>

      <div className="field">
        <label htmlFor={ageId}>Возраст</label>
        <input
          id={ageId}
          type="text"
          inputMode="numeric"
          value={participant.age}
          autoComplete="off"
          aria-invalid={ageError ? true : undefined}
          aria-describedby={ageError ? `${ageId}-error` : undefined}
          onChange={(event) => onChange('age', event.target.value)}
          onBlur={() => onBlurField(ageId)}
        />
        {ageError && (
          <p className="field__error" id={`${ageId}-error`}>
            {ageError}
          </p>
        )}
        {showBadge && <span className="badge">{formatTicketBadge(age)}</span>}
      </div>
    </li>
  );
}
