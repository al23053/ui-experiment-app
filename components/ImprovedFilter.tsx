'use client';

import { useState } from 'react';

interface Props {
  onComplete: () => void;
}

type Filter = 'all' | 'incomplete' | 'done';

const allTasks = [
  { id: 1, title: 'デザインレビュー', done: true },
  { id: 2, title: 'APIの実装', done: false },
  { id: 3, title: 'テストの作成', done: true },
  { id: 4, title: 'ドキュメント更新', done: false },
  { id: 5, title: 'バグ修正 #142', done: true },
];

const filterOptions: { key: Filter; label: string }[] = [
  { key: 'all', label: 'すべて' },
  { key: 'incomplete', label: '未完了' },
  { key: 'done', label: '完了済み' },
];

export default function ImprovedFilter({ onComplete }: Props) {
  const [filter, setFilter] = useState<Filter>('all');
  const [completed, setCompleted] = useState(false);

  const handleFilter = (key: Filter) => {
    setFilter(key);
    if (key === 'done' && !completed) {
      setCompleted(true);
      onComplete();
    }
  };

  const visibleTasks =
    filter === 'all'
      ? allTasks
      : filter === 'incomplete'
      ? allTasks.filter((t) => !t.done)
      : allTasks.filter((t) => t.done);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {filterOptions.map((option) => (
          <button
            key={option.key}
            onClick={() => handleFilter(option.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === option.key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {option.label}
            <span
              className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                filter === option.key ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              {option.key === 'all'
                ? allTasks.length
                : option.key === 'incomplete'
                ? allTasks.filter((t) => !t.done).length
                : allTasks.filter((t) => t.done).length}
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {visibleTasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-lg"
          >
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                task.done
                  ? 'bg-green-500 border-green-500'
                  : 'border-gray-300'
              }`}
            >
              {task.done && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span
              className={`text-sm ${
                task.done ? 'text-gray-400 line-through' : 'text-gray-900 font-medium'
              }`}
            >
              {task.title}
            </span>
            <span
              className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                task.done
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {task.done ? '完了' : '未完了'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
