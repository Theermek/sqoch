import { formatPrice, getTicketLabel, toOrderParticipants } from '../domain/pricing';
import type { CheckoutState } from '../state/checkoutReducer';
import { OrderSummary } from './OrderSummary';

interface Props {
  state: CheckoutState;
  onEdit: () => void;
  onConfirm: () => void;
}

export function ReviewStep({ state, onEdit, onConfirm }: Props) {
  const isLoading = state.status === 'loading';
  const participants = toOrderParticipants(state.participants);

  return (
    <section className="card">
      <h2 className="card__title">Проверка заказа</h2>

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

      <dl className="meta">
        <div className="meta__row">
          <dt>Email</dt>
          <dd>{state.email.trim()}</dd>
        </div>
      </dl>

      <OrderSummary participants={state.participants} />

      <div className="actions">
        <button type="button" className="btn btn--secondary" onClick={onEdit} disabled={isLoading}>
          Изменить
        </button>
        <button type="button" className="btn btn--primary" onClick={onConfirm} disabled={isLoading}>
          {isLoading ? 'Оформляем…' : 'Подтвердить и оплатить'}
        </button>
      </div>
    </section>
  );
}
