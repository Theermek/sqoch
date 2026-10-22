import { CHILD_AGE, PRICES } from '../constants';
import type { OrderParticipant, Participant, TicketType } from '../types';

/** Разбирает ввод возраста. Возвращает null, если это не целое число. */
export function parseAge(raw: string): number | null {
  const trimmed = raw.trim();
  if (trimmed === '') return null;
  if (!/^\d+$/.test(trimmed)) return null;
  return Number(trimmed);
}

/** Тип билета определяется только возрастом, пользователь его не выбирает. */
export function getTicketType(age: number): TicketType {
  return age < CHILD_AGE ? 'child' : 'full';
}

export function getPrice(age: number): number {
  return PRICES[getTicketType(age)];
}

/** Итог по заказу. Участники с незаполненным возрастом ещё ничего не стоят. */
export function getTotal(participants: Participant[]): number {
  return participants.reduce((sum, participant) => {
    const age = parseAge(participant.age);
    return age === null ? sum : sum + getPrice(age);
  }, 0);
}

const TICKET_LABELS: Record<TicketType, string> = {
  full: 'Полный',
  child: 'Детский',
};

export function getTicketLabel(type: TicketType): string {
  return TICKET_LABELS[type];
}

const priceFormatter = new Intl.NumberFormat('ru-RU');

/** 2000 -> "2 000 ₽" */
export function formatPrice(value: number): string {
  return `${priceFormatter.format(value)} ₽`;
}

/** "Полный · 2 000 ₽" — бейдж рядом с полем возраста. */
export function formatTicketBadge(age: number): string {
  const type = getTicketType(age);
  return `${getTicketLabel(type)} · ${formatPrice(PRICES[type])}`;
}

/**
 * Готовит участников к отправке в API: разобранный возраст, тип и цена.
 * Вызывается только после успешной валидации.
 */
export function toOrderParticipants(participants: Participant[]): OrderParticipant[] {
  return participants.map((participant) => {
    const age = parseAge(participant.age) ?? 0;
    return {
      name: participant.name.trim(),
      age,
      ticketType: getTicketType(age),
      price: getPrice(age),
    };
  });
}
