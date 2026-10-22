import { formatTickets } from '../domain/format';
import { formatPrice, getTotal } from '../domain/pricing';
import type { Participant } from '../types';

interface Props {
  participants: Participant[];
  /** На шаге участников итог прилипает к низу экрана на мобильном. */
  sticky?: boolean;
}

export function OrderSummary({ participants, sticky = false }: Props) {
  const total = getTotal(participants);

  return (
    <div className={`summary${sticky ? ' summary--sticky' : ''}`} aria-live="polite">
      <span className="summary__count">{formatTickets(participants.length)}</span>
      <span className="summary__total">{formatPrice(total)}</span>
    </div>
  );
}
