import type { ApiError, EventInfo, OrderRequest, OrderSuccess } from '../types';

const EVENT: Omit<EventInfo, 'seatsLeft'> = {
  id: 'evt-1',
  title: 'Фестиваль «Городские огни»',
  date: '12 декабря 2026, 19:00',
  venue: 'Москва, Крокус Сити Холл',
};

/** Состояние мока живёт в модуле и уменьшается после успешного заказа. */
let seatsLeft = 3;

/**
 * Демо-режим: confirmOrder всегда реджектится как SOLD_OUT, даже если места были.
 * Имитирует ситуацию «их выкупили, пока пользователь заполнял форму».
 */
let soldOutMode = new URLSearchParams(window.location.search).get('soldout') === '1';

export function isSoldOutMode(): boolean {
  return soldOutMode;
}

export function setSoldOutMode(value: boolean): void {
  soldOutMode = value;
}

function delay(): Promise<void> {
  const ms = 600 + Math.random() * 400;
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getEvent(): Promise<EventInfo> {
  await delay();
  return { ...EVENT, seatsLeft };
}

export async function confirmOrder(order: OrderRequest): Promise<OrderSuccess> {
  await delay();

  if (soldOutMode || order.participants.length > seatsLeft) {
    const error: ApiError = { type: 'SOLD_OUT', seatsLeft };
    throw error;
  }

  seatsLeft -= order.participants.length;
  const total = order.participants.reduce((sum, participant) => sum + participant.price, 0);

  return {
    orderId: `SQ-${Math.floor(1000 + Math.random() * 9000)}`,
    total,
    seatsLeft,
  };
}
