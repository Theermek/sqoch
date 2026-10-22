import type { Step } from '../state/checkoutReducer';

const STEPS: { step: Step; label: string }[] = [
  { step: 'participants', label: 'Участники' },
  { step: 'review', label: 'Проверка' },
  { step: 'result', label: 'Готово' },
];

interface Props {
  current: Step;
}

export function StepIndicator({ current }: Props) {
  const currentIndex = STEPS.findIndex((item) => item.step === current);
  if (currentIndex === -1) return null;

  return (
    <ol className="steps" aria-label="Шаги оформления">
      {STEPS.map((item, index) => {
        const isCurrent = index === currentIndex;
        const isDone = index < currentIndex;
        return (
          <li
            key={item.step}
            className={`steps__item${isCurrent ? ' steps__item--current' : ''}${
              isDone ? ' steps__item--done' : ''
            }`}
            aria-current={isCurrent ? 'step' : undefined}
          >
            <span className="steps__num">{index + 1}</span>
            <span className="steps__label">{item.label}</span>
          </li>
        );
      })}
    </ol>
  );
}
