import { clsx } from 'clsx';

interface Props {
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export function DifficultyPill({ difficulty }: Props) {
  return (
    <span
      className={clsx(
        'inline-block rounded px-2 py-0.5 text-[10.5px] font-semibold tracking-wide',
        {
          'bg-easy-bg text-easy': difficulty === 'Easy',
          'bg-medium-bg text-medium': difficulty === 'Medium',
          'bg-hard-bg text-hard': difficulty === 'Hard',
        }
      )}
    >
      {difficulty}
    </span>
  );
}