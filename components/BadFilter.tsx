'use client';

import { useState } from 'react';

interface Props {
  onComplete: () => void;
}

const allTasks = [
  { id: 1, title: 'デザインレビュー', done: true },
  { id: 2, title: 'APIの実装', done: false },
  { id: 3, title: 'テストの作成', done: true },
  { id: 4, title: 'ドキュメント更新', done: false },
  { id: 5, title: 'バグ修正 #142', done: true },
];

export default function BadFilter({ onComplete }: Props) {
  const [filter, setFilter] = useState(0);
  const [applied, setApplied] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleApply = () => {
    setApplied(true);
    // filter=2 が完了済みのみ表示
    if (filter === 2 && !completed) {
      setCompleted(true);
      onComplete();
    }
  };

  const visibleTasks = !applied
    ? allTasks
    : filter === 0
    ? allTasks
    : filter === 1
    ? allTasks.filter((t) => !t.done)
    : allTasks.filter((t) => t.done);

  return (
    <div>
      <div style={{ marginBottom: '8px', display: 'flex', gap: '4px', alignItems: 'center' }}>
        <span style={{ fontSize: '12px' }}>表示：</span>
        {[0, 1, 2].map((v) => (
          <button
            key={v}
            onClick={() => { setFilter(v); setApplied(false); }}
            style={{
              padding: '2px 6px',
              fontSize: '12px',
              background: filter === v ? '#555' : '#ddd',
              color: filter === v ? 'white' : '#333',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {v}
          </button>
        ))}
        <button
          onClick={handleApply}
          style={{
            padding: '2px 8px',
            fontSize: '12px',
            background: '#888',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            marginLeft: '4px',
          }}
        >
          適用
        </button>
      </div>

      <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#eee' }}>
            <th style={{ padding: '4px', textAlign: 'left' }}>タスク</th>
            <th style={{ padding: '4px', textAlign: 'center' }}>状態</th>
          </tr>
        </thead>
        <tbody>
          {visibleTasks.map((task) => (
            <tr key={task.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '4px' }}>{task.title}</td>
              <td style={{ padding: '4px', textAlign: 'center', fontSize: '11px', color: '#888' }}>
                {task.done ? '1' : '0'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
