import { useMemo } from 'react';

export const useCardColor = (name: string) => {
  return useMemo(() => {
    const hash = name.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 80%)`;
  }, [name]);
};