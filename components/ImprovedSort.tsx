'use client';

import { useState } from 'react';

interface Props {
  onComplete: () => void;
}

type SortKey = 'default' | 'price-asc' | 'price-desc';

const initialProducts = [
  { id: 1, name: 'ワイヤレスイヤホン', price: 8800 },
  { id: 2, name: 'USBハブ', price: 2200 },
  { id: 3, name: 'ウェブカメラ', price: 6500 },
  { id: 4, name: 'キーボード', price: 12000 },
  { id: 5, name: 'マウスパッド', price: 980 },
];

const sortOptions: { key: SortKey; label: string }[] = [
  { key: 'default', label: 'デフォルト' },
  { key: 'price-asc', label: '価格：安い順' },
  { key: 'price-desc', label: '価格：高い順' },
];

export default function ImprovedSort({ onComplete }: Props) {
  const [currentSort, setCurrentSort] = useState<SortKey>('default');
  const [completed, setCompleted] = useState(false);

  const handleSort = (key: SortKey) => {
    setCurrentSort(key);
    if (key === 'price-asc' && !completed) {
      setCompleted(true);
      onComplete();
    }
  };

  const sortedProducts = [...initialProducts].sort((a, b) => {
    if (currentSort === 'price-asc') return a.price - b.price;
    if (currentSort === 'price-desc') return b.price - a.price;
    return a.id - b.id;
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {sortOptions.map((option) => (
          <button
            key={option.key}
            onClick={() => handleSort(option.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentSort === option.key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {option.key === 'price-asc' && '↑ '}
            {option.key === 'price-desc' && '↓ '}
            {option.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {sortedProducts.map((product, index) => (
          <div
            key={product.id}
            className="flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400 w-4">{index + 1}</span>
              <span className="text-sm font-medium text-gray-900">{product.name}</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">
              ¥{product.price.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
