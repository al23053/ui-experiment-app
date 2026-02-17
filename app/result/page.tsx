'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { getAggregatedResults, type AggregatedResult } from '@/lib/storage';
import { tasks } from '@/lib/tasks';

interface TaskResult {
  taskId: string;
  description: string;
  results: AggregatedResult[];
}

function ResultContent() {
  const [resultsByTask, setResultsByTask] = useState<TaskResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const data = await Promise.all(
          tasks.map(async (task) => ({
            taskId: task.id,
            description: task.description,
            results: await getAggregatedResults(task.id),
          }))
        );
        setResultsByTask(data);
      } catch (error) {
        console.error('Failed to fetch results:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, []);

  const formatDuration = (ms: number) => `${(ms / 1000).toFixed(2)}s`;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-lg mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">実験結果</h1>

        {resultsByTask.map(({ taskId, description, results }) => {
          const badResult = results.find((r) => r.variant === 'bad');
          const improvedResult = results.find((r) => r.variant === 'improved');

          return (
            <div key={taskId} className="bg-white rounded-lg shadow-md p-6">
              <p className="text-sm font-medium text-gray-700 mb-4">
                {description}
              </p>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-xs font-semibold text-red-900 mb-1">Bad UI</p>
                  {badResult ? (
                    <>
                      <p className="text-2xl font-bold text-red-600">
                        {formatDuration(badResult.avgDuration)}
                      </p>
                      <p className="text-xs text-red-700 mt-1">n={badResult.count}</p>
                    </>
                  ) : (
                    <p className="text-sm text-gray-400">データなし</p>
                  )}
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-xs font-semibold text-green-900 mb-1">Improved UI</p>
                  {improvedResult ? (
                    <>
                      <p className="text-2xl font-bold text-green-600">
                        {formatDuration(improvedResult.avgDuration)}
                      </p>
                      <p className="text-xs text-green-700 mt-1">n={improvedResult.count}</p>
                    </>
                  ) : (
                    <p className="text-sm text-gray-400">データなし</p>
                  )}
                </div>
              </div>

              {badResult && improvedResult && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs font-semibold text-blue-900 mb-1">改善効果</p>
                  <p className="text-xl font-bold text-blue-600">
                    {((1 - improvedResult.avgDuration / badResult.avgDuration) * 100).toFixed(1)}%
                    の時間短縮
                  </p>
                </div>
              )}
            </div>
          );
        })}

        <div className="text-center pb-8">
          <Link
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            もう一度実験する
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-gray-600">Loading...</div>
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
