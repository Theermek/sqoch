import { PRICES } from '../constants';
import { formatSeats } from '../domain/format';
import { formatPrice } from '../domain/pricing';
import type { EventInfo } from '../types';

interface Props {
  event: EventInfo;
  onStart: () => void;
}

export function EventCard({ event, onStart }: Props) {
  const soldOut = event.seatsLeft === 0;

  return (
    <section className="card">
      <h1 className="card__title">{event.title}</h1>
      <dl className="meta">
        <div className="meta__row">
          <dt>Когда</dt>
          <dd>{event.date}</dd>
        </div>
        <div className="meta__row">
          <dt>Где</dt>
          <dd>{event.venue}</dd>
        </div>
        <div className="meta__row">
          <dt>Цены</dt>
          <dd>
            Полный {formatPrice(PRICES.full)} · детский {formatPrice(PRICES.child)}
          </dd>
        </div>
        <div className="meta__row">
          <dt>Осталось</dt>
          <dd>{soldOut ? 'мест нет' : formatSeats(event.seatsLeft)}</dd>
        </div>
      </dl>
      <button type="button" className="btn btn--primary" onClick={onStart} disabled={soldOut}>
        Купить билеты
      </button>
    </section>
  );
}
