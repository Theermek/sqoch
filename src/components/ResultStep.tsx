import { formatSeats } from '../domain/format';
import { formatPrice, getTicketLabel, toOrderParticipants } from '../domain/pricing';
import type { CheckoutState } from '../state/checkoutReducer';

/** Сообщение зависит от того, хватает ли оставшихся мест на текущий заказ. */
function soldOutMessage(seatsLeft: number, ordered: number): string {
  if (seatsLeft === 0) {
    return 'Пока вы заполняли форму, все билеты выкупили — свободных мест не осталось.';
  }
  if (seatsLeft < ordered) {
    return `Билеты разобрали во время оформления: осталось ${formatSeats(seatsLeft)}, а в заказе ${ordered}. Уменьшите число участников.`;
  }
  return `Оплатить не удалось: билеты успели выкупить, пока вы оформляли заказ. Сейчас свободно ${formatSeats(seatsLeft)}.`;
}

interface Props {
  state: CheckoutState;
  onEdit: () => void;
  onRetry: () => void;
  onReset: () => void;
}

export function ResultStep({ state, onEdit, onRetry, onReset }: Props) {
  if (state.status === 'loading') {
    return (
      <p className="loading" aria-live="polite">
        Оформляем заказ…
      </p>
    );
  }

  if (state.success) {
    const participants = toOrderParticipants(state.participants);
    return (
      <section className="card" role="status" aria-live="polite">
        <h2 className="card__title">Заказ оформлен</h2>
        <p className="result__order">Номер заказа: {state.success.orderId}</p>

        <ul className="review">
          {participants.map((participant, index) => (
            <li className="review__row" key={`${participant.name}-${index}`}>
              <span className="review__name">
                {participant.name}, {participant.age}
              </span>
              <span className="review__ticket">
                {getTicketLabel(participant.ticketType)} · {formatPrice(participant.price)}
              </span>
            </li>
          ))}
        </ul>

        <p className="result__total">Оплачено: {formatPrice(state.success.total)}</p>
        <p className="hint">Билеты отправлены на {state.email.trim()}</p>

        <button type="button" className="btn btn--primary" onClick={onReset}>
          Оформить ещё
        </button>
      </section>
    );
  }

  if (state.error?.type === 'SOLD_OUT') {
    const { seatsLeft } = state.error;
    return (
      <section className="card" role="alert" aria-live="assertive">
        <h2 className="card__title">Места закончились</h2>
        <p>{soldOutMessage(seatsLeft, state.participants.length)}</p>
        <div className="actions">
          <button type="button" className="btn btn--primary" onClick={onEdit}>
            Изменить заказ
          </button>
          <button type="button" className="btn btn--secondary" onClick={onReset}>
            В начало
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="card" role="alert" aria-live="assertive">
      <h2 className="card__title">Не удалось оформить заказ</h2>
      <p>{state.error?.type === 'NETWORK' ? state.error.message : 'Произошла неизвестная ошибка.'}</p>
      <div className="actions">
        <button type="button" className="btn btn--primary" onClick={onRetry}>
          Повторить
        </button>
        <button type="button" className="btn btn--secondary" onClick={onEdit}>
          Изменить заказ
        </button>
      </div>
    </section>
  );
}
