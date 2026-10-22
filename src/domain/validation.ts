import { ADULT_AGE, CHILD_AGE, MAX_AGE, MIN_AGE } from '../constants';
import type { Participant } from '../types';
import { parseAge } from './pricing';

export interface ValidationResult {
  /** Ошибки полей по ключу: nameFieldId(id) / ageFieldId(id) / EMAIL_FIELD. */
  fieldErrors: Record<string, string>;
  /** Ошибки заказа в целом (правило сопровождения) — блоком над списком. */
  formErrors: string[];
  isValid: boolean;
}

export interface OrderDraft {
  participants: Participant[];
  email: string;
}

export const EMAIL_FIELD = 'email';

export function nameFieldId(participantId: string): string {
  return `name:${participantId}`;
}

export function ageFieldId(participantId: string): string {
  return `age:${participantId}`;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateOrder({ participants, email }: OrderDraft): ValidationResult {
  const fieldErrors: Record<string, string> = {};
  const formErrors: string[] = [];
  const ages: number[] = [];

  for (const participant of participants) {
    if (participant.name.trim() === '') {
      fieldErrors[nameFieldId(participant.id)] = 'Укажите имя участника';
    }

    const age = parseAge(participant.age);
    if (age === null) {
      fieldErrors[ageFieldId(participant.id)] = 'Укажите возраст целым числом';
    } else if (age < MIN_AGE || age > MAX_AGE) {
      fieldErrors[ageFieldId(participant.id)] = `Возраст от ${MIN_AGE} до ${MAX_AGE}`;
    } else {
      ages.push(age);
    }
  }

  const trimmedEmail = email.trim();
  if (trimmedEmail === '') {
    fieldErrors[EMAIL_FIELD] = 'Укажите email для отправки билетов';
  } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
    fieldErrors[EMAIL_FIELD] = 'Проверьте формат email';
  }

  // Правило сопровождения проверяем только когда все возрасты разобраны:
  // иначе сообщение будет мигать на полузаполненной форме.
  const allAgesValid = ages.length === participants.length;
  if (allAgesValid) {
    const hasChild = ages.some((age) => age < CHILD_AGE);
    const hasAdult = ages.some((age) => age >= ADULT_AGE);
    if (hasChild && !hasAdult) {
      formErrors.push(
        `В заказе есть участник младше ${CHILD_AGE} лет — добавьте сопровождающего от ${ADULT_AGE} лет.`,
      );
    }
  }

  return {
    fieldErrors,
    formErrors,
    isValid: Object.keys(fieldErrors).length === 0 && formErrors.length === 0,
  };
}
