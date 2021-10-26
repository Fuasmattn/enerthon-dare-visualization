import { useState, useEffect } from 'react';

export const useData = () => {
  const [data, setData] = useState<{
    data: Array<{ x: number; y: number }>;
  }>({
    data: [],
  });

  useEffect(() => {
    setData({
      data: [
        { x: 10, y: 20 },
        { x: 40, y: 90 },
        { x: 80, y: 50 },
      ],
    });
  }, []);

  return data;
};
