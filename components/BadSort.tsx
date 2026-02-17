'use client';

import { useState } from 'react';

interface Props {
  onComplete: () => void;
}

const initialProducts = [
  { id: 1, name: 'ワイヤレスイヤホン', price: 8800 },
  { id: 2, name: 'USBハブ', price: 2200 },
  { id: 3, name: 'ウェブカメラ', price: 6500 },
  { id: 4, name: 'キーボード', price: 12000 },
  { id: 5, name: 'マウスパッド', price: 980 },
];

export default function BadSort({ onComplete }: Props) {
  const [products, setProducts] = useState(initialProducts);
  const [sortState, setSortState] = useState(0); // 0:なし 1:昇順 2:降順

  const handleSort = () => {
    const next = (sortState + 1) % 3;
    setSortState(next);

    if (next === 0) {
      setProducts(initialProducts);
    } else if (next === 1) {
      const sorted = [...products].sort((a, b) => a.price - b.price);
      setProducts(sorted);
      // 安い順（昇順）になったら完了
      onComplete();
    } else {
      const sorted = [...products].sort((a, b) => b.price - a.price);
      setProducts(sorted);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '8px' }}>
        <button
          onClick={handleSort}
          style={{
            background: '#888',
            color: 'white',
            border: 'none',
            padding: '3px 8px',
            fontSize: '12px',
            cursor: 'pointer',
          }}
        >
          並替 {sortState === 1 ? '▲' : sortState === 2 ? '▼' : ''}
        </button>
      </div>

      <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#eee' }}>
            <th style={{ padding: '4px', textAlign: 'left' }}>商品</th>
            <th style={{ padding: '4px', textAlign: 'right' }}>価格</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '4px' }}>{product.name}</td>
              <td style={{ padding: '4px', textAlign: 'right' }}>
                {product.price}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
