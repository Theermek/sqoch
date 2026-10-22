import { useCallback, useEffect, useReducer, useState } from 'react';

import { confirmOrder, getEvent } from './api/mockApi';
import { DemoPanel } from './components/DemoPanel';
import { EventCard } from './components/EventCard';
import { ParticipantsStep } from './components/ParticipantsStep';
import { ResultStep } from './components/ResultStep';
import { ReviewStep } from './components/ReviewStep';
import { StepIndicator } from './components/StepIndicator';
import { toOrderParticipants } from './domain/pricing';
import { checkoutReducer, createInitialState } from './state/checkoutReducer';
import type { ApiError, EventInfo } from './types';

function toApiError(error: unknown): ApiError {
  if (error && typeof error === 'object' && 'type' in error) {
    return error as ApiError;
  }
  return { type: 'NETWORK', message: 'Сервис недоступен. Проверьте соединение и попробуйте снова.' };
}

export function App() {
  const [state, dispatch] = useReducer(checkoutReducer, undefined, createInitialState);
  const [event, setEvent] = useState<EventInfo | null>(null);
  const [eventError, setEventError] = useState(false);

  const loadEvent = useCallback(() => {
    setEventError(false);
    setEvent(null);
    getEvent()
      .then(setEvent)
      .catch(() => setEventError(true));
  }, []);

  useEffect(loadEvent, [loadEvent]);

  const handleConfirm = useCallback(() => {
    if (state.status === 'loading' || !event) return;
    dispatch({ type: 'CONFIRM_START' });
    confirmOrder({
      eventId: event.id,
      email: state.email.trim(),
      participants: toOrderParticipants(state.participants),
    })
      .then((result) => dispatch({ type: 'CONFIRM_SUCCESS', result }))
      .catch((error: unknown) => dispatch({ type: 'CONFIRM_ERROR', error: toApiError(error) }));
  }, [event, state.email, state.participants, state.status]);

  const handleReset = useCallback(() => {
    dispatch({ type: 'RESET' });
    loadEvent();
  }, [loadEvent]);

  return (
    <div className="page">
      <main className="container">
        <StepIndicator current={state.step} />

        {state.step === 'event' &&
          (eventError ? (
            <section className="card" role="alert">
              <h2 className="card__title">Не удалось загрузить мероприятие</h2>
              <button type="button" className="btn btn--primary" onClick={loadEvent}>
                Повторить
              </button>
            </section>
          ) : event ? (
            <EventCard event={event} onStart={() => dispatch({ type: 'START_CHECKOUT' })} />
          ) : (
            <p className="loading" aria-live="polite">
              Загружаем мероприятие…
            </p>
          ))}

        {state.step === 'participants' && <ParticipantsStep state={state} dispatch={dispatch} />}

        {state.step === 'review' && (
          <ReviewStep
            state={state}
            onEdit={() => dispatch({ type: 'EDIT_ORDER' })}
            onConfirm={handleConfirm}
          />
        )}

        {state.step === 'result' && (
          <ResultStep
            state={state}
            onEdit={() => dispatch({ type: 'EDIT_ORDER' })}
            onRetry={handleConfirm}
            onReset={handleReset}
          />
        )}
      </main>
      <DemoPanel />
    </div>
  );
}
