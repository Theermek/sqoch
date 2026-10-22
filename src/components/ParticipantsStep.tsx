import type { FormEvent } from 'react';

import { MAX_PARTICIPANTS, MIN_PARTICIPANTS } from '../constants';
import {
  EMAIL_FIELD,
  ageFieldId,
  nameFieldId,
  validateOrder,
} from '../domain/validation';
import type { CheckoutAction, CheckoutState } from '../state/checkoutReducer';
import { shouldShowFieldError } from '../state/checkoutReducer';
import { OrderSummary } from './OrderSummary';
import { ParticipantForm } from './ParticipantForm';

interface Props {
  state: CheckoutState;
  dispatch: (action: CheckoutAction) => void;
}

export function ParticipantsStep({ state, dispatch }: Props) {
  const { fieldErrors, formErrors, isValid } = validateOrder({
    participants: state.participants,
    email: state.email,
  });

  const visibleError = (field: string): string | undefined =>
    shouldShowFieldError(state, field) ? fieldErrors[field] : undefined;

  const emailError = visibleError(EMAIL_FIELD);
  const canRemove = state.participants.length > MIN_PARTICIPANTS;
  const canAdd = state.participants.length < MAX_PARTICIPANTS;

  /** Порядок полей на странице — по нему ищем первое ошибочное для фокуса. */
  function firstErrorField(): string | undefined {
    for (const participant of state.participants) {
      for (const field of [nameFieldId(participant.id), ageFieldId(participant.id)]) {
        if (fieldErrors[field]) return field;
      }
    }
    return fieldErrors[EMAIL_FIELD] ? EMAIL_FIELD : undefined;
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    dispatch({ type: 'SUBMIT_PARTICIPANTS' });
    if (isValid) return;

    const field = firstErrorField();
    if (field) {
      document.getElementById(field)?.focus();
    } else {
      // Ошибка только в правиле сопровождения — ведём внимание к блоку над списком.
      document.getElementById('form-errors')?.focus();
    }
  }

  return (
    <form className="card" onSubmit={handleSubmit} noValidate>
      <h2 className="card__title">Участники и контакт</h2>

      {state.showErrors && formErrors.length > 0 && (
        <div className="alert" id="form-errors" role="alert" tabIndex={-1}>
          {formErrors.map((message) => (
            <p key={message}>{message}</p>
          ))}
        </div>
      )}

      <ul className="participants">
        {state.participants.map((participant, index) => (
          <ParticipantForm
            key={participant.id}
            participant={participant}
            index={index}
            canRemove={canRemove}
            nameError={visibleError(nameFieldId(participant.id))}
            ageError={visibleError(ageFieldId(participant.id))}
            onChange={(field, value) =>
              dispatch({ type: 'UPDATE_PARTICIPANT', id: participant.id, field, value })
            }
            onBlurField={(field) => dispatch({ type: 'TOUCH_FIELD', field })}
            onRemove={() => dispatch({ type: 'REMOVE_PARTICIPANT', id: participant.id })}
          />
        ))}
      </ul>

      <button
        type="button"
        className="btn btn--secondary"
        onClick={() => dispatch({ type: 'ADD_PARTICIPANT' })}
        disabled={!canAdd}
      >
        Добавить участника
      </button>
      {!canAdd && <p className="hint">Максимум {MAX_PARTICIPANTS} участника в одном заказе.</p>}

      <div className="field">
        <label htmlFor={EMAIL_FIELD}>Email для билетов</label>
        <input
          id={EMAIL_FIELD}
          type="email"
          autoComplete="email"
          value={state.email}
          aria-invalid={emailError ? true : undefined}
          aria-describedby={emailError ? `${EMAIL_FIELD}-error` : undefined}
          onChange={(event) => dispatch({ type: 'SET_EMAIL', value: event.target.value })}
          onBlur={() => dispatch({ type: 'TOUCH_FIELD', field: EMAIL_FIELD })}
        />
        {emailError && (
          <p className="field__error" id={`${EMAIL_FIELD}-error`}>
            {emailError}
          </p>
        )}
      </div>

      <OrderSummary participants={state.participants} sticky />

      <button type="submit" className="btn btn--primary">
        Далее
      </button>
    </form>
  );
}
