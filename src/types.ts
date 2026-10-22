export type TicketType = 'full' | 'child';

/**
 * Участник в состоянии формы. Возраст хранится строкой: это сырой ввод,
 * который нужно отличать от нуля и от незаполненного поля.
 */
export interface Participant {
  id: string;
  name: string;
  age: string;
}

export interface EventInfo {
  id: string;
  title: string;
  date: string;
  venue: string;
  seatsLeft: number;
}

/** Участник с уже разобранным возрастом — то, что уходит в API. */
export interface OrderParticipant {
  name: string;
  age: number;
  ticketType: TicketType;
  price: number;
}

export interface OrderRequest {
  eventId: string;
  email: string;
  participants: OrderParticipant[];
}

export interface OrderSuccess {
  orderId: string;
  total: number;
  seatsLeft: number;
}

export type ApiError =
  | { type: 'SOLD_OUT'; seatsLeft: number }
  | { type: 'NETWORK'; message: string };
