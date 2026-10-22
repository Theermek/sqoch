import { MAX_PARTICIPANTS, MIN_PARTICIPANTS } from '../constants';
import { validateOrder } from '../domain/validation';
import type { ApiError, OrderSuccess, Participant } from '../types';

export type Step = 'event' | 'participants' | 'review' | 'result';
export type ConfirmStatus = 'idle' | 'loading' | 'success' | 'error';

export interface CheckoutState {
  step: Step;
  participants: Participant[];
  email: string;
  /** Включается после попытки «Далее»: до этого ошибки показываем только по blur. */
  showErrors: boolean;
  touched: Record<string, true>;
  status: ConfirmStatus;
  success: OrderSuccess | null;
  error: ApiError | null;
}

export type CheckoutAction =
  | { type: 'START_CHECKOUT' }
  | { type: 'ADD_PARTICIPANT' }
  | { type: 'REMOVE_PARTICIPANT'; id: string }
  | { type: 'UPDATE_PARTICIPANT'; id: string; field: 'name' | 'age'; value: string }
  | { type: 'SET_EMAIL'; value: string }
  | { type: 'TOUCH_FIELD'; field: string }
  | { type: 'SUBMIT_PARTICIPANTS' }
  | { type: 'EDIT_ORDER' }
  | { type: 'CONFIRM_START' }
  | { type: 'CONFIRM_SUCCESS'; result: OrderSuccess }
  | { type: 'CONFIRM_ERROR'; error: ApiError }
  | { type: 'RESET' };

let participantCounter = 0;

function createParticipant(): Participant {
  participantCounter += 1;
  return { id: `p${participantCounter}`, name: '', age: '' };
}

export function createInitialState(): CheckoutState {
  return {
    step: 'event',
    participants: [createParticipant()],
    email: '',
    showErrors: false,
    touched: {},
    status: 'idle',
    success: null,
    error: null,
  };
}

export function checkoutReducer(state: CheckoutState, action: CheckoutAction): CheckoutState {
  switch (action.type) {
    case 'START_CHECKOUT':
      return { ...state, step: 'participants' };

    case 'ADD_PARTICIPANT':
      if (state.participants.length >= MAX_PARTICIPANTS) return state;
      return { ...state, participants: [...state.participants, createParticipant()] };

    case 'REMOVE_PARTICIPANT':
      if (state.participants.length <= MIN_PARTICIPANTS) return state;
      return {
        ...state,
        participants: state.participants.filter((participant) => participant.id !== action.id),
      };

    case 'UPDATE_PARTICIPANT':
      return {
        ...state,
        participants: state.participants.map((participant) =>
          participant.id === action.id
            ? { ...participant, [action.field]: action.value }
            : participant,
        ),
      };

    case 'SET_EMAIL':
      return { ...state, email: action.value };

    case 'TOUCH_FIELD':
      if (state.touched[action.field]) return state;
      return { ...state, touched: { ...state.touched, [action.field]: true } };

    case 'SUBMIT_PARTICIPANTS': {
      const { isValid } = validateOrder({
        participants: state.participants,
        email: state.email,
      });
      if (!isValid) return { ...state, showErrors: true };
      return { ...state, showErrors: false, step: 'review' };
    }

    case 'EDIT_ORDER':
      // Данные сохраняются: возвращаем только шаг и статус запроса.
      return { ...state, step: 'participants', status: 'idle', error: null };

    case 'CONFIRM_START':
      // Защита от двойного клика: повторный запуск во время запроса игнорируется.
      if (state.status === 'loading') return state;
      return { ...state, status: 'loading', error: null };

    case 'CONFIRM_SUCCESS':
      return { ...state, step: 'result', status: 'success', success: action.result, error: null };

    case 'CONFIRM_ERROR':
      return { ...state, step: 'result', status: 'error', error: action.error, success: null };

    case 'RESET':
      return createInitialState();

    default:
      return state;
  }
}

/** Ошибку поля показываем после «Далее» или после того, как поле потеряло фокус. */
export function shouldShowFieldError(state: CheckoutState, field: string): boolean {
  return state.showErrors || state.touched[field] === true;
}
