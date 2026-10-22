/**
 * Бизнес-параметры заказа. Все правила вынесены сюда:
 * изменение цены или порога возраста — правка одной строки.
 */

/** Возраст, с которого билет считается полным (младше — детский). */
export const CHILD_AGE = 14;

/** Возраст, с которого участник может быть сопровождающим для ребёнка. */
export const ADULT_AGE = 18;

/** Цены билетов, ₽. */
export const PRICES = {
  full: 2000,
  child: 1000,
} as const;

export const MIN_PARTICIPANTS = 1;
export const MAX_PARTICIPANTS = 4;

export const MIN_AGE = 0;
export const MAX_AGE = 120;
