/** "5 мест" / "1 место" / "2 места" */
export function formatSeats(count: number): string {
  const mod100 = count % 100;
  const mod10 = count % 10;
  let word = 'мест';
  if (mod10 === 1 && mod100 !== 11) word = 'место';
  else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) word = 'места';
  return `${count} ${word}`;
}

/** "1 билет" / "2 билета" / "5 билетов" */
export function formatTickets(count: number): string {
  const mod100 = count % 100;
  const mod10 = count % 10;
  let word = 'билетов';
  if (mod10 === 1 && mod100 !== 11) word = 'билет';
  else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) word = 'билета';
  return `${count} ${word}`;
}
