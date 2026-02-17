'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getAggregatedResults, type AggregatedResult } from '@/lib/storage';
import { tasks } from '@/lib/tasks';
import { Suspense } from 'react';

function ResultContent() {
  const searchParams = useSearchParams();
  const taskId = searchParams.get('task');
  const [results, setResults] = useState<AggregatedResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const currentTask = tasks.find((t) => t.id === taskId);

  useEffect(() => {
    if (!taskId) return;
    const fetchResults = async () => {
      try {
        const data = await getAggregatedResults(taskId);
        setResults(data);
      } catch (error) {
        console.error('Failed to fetch results:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResults();
  }, [taskId]);

  const formatDuration = (ms: number) => `${(ms / 1000).toFixed(2)}s`;

  const badResult = results.find((r) => r.variant === 'bad');
  const improvedResult = results.find((r) => r.variant === 'improved');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">実験結果</h1>
          <p className="text-gray-500 text-sm mb-8">
            {currentTask?.description}
          </p>

          {results.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-2">まだデータがありません</p>
              <p className="text-sm text-gray-400">あなたが最初の参加者です！</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-red-50 p-5 rounded-lg">
                  <h3 className="text-sm font-semibold text-red-900 mb-2">Bad UI</h3>
                  {badResult ? (
                    <>
                      <p className="text-3xl font-bold text-red-600 mb-1">
                        {formatDuration(badResult.avgDuration)}
                      </p>
                      <p className="text-xs text-red-700">n={badResult.count}</p>
                    </>
                  ) : (
                    <p className="text-gray-400 text-sm">データなし</p>
                  )}
                </div>
                <div className="bg-green-50 p-5 rounded-lg">
                  <h3 className="text-sm font-semibold text-green-900 mb-2">Improved UI</h3>
                  {improvedResult ? (
                    <>
                      <p className="text-3xl font-bold text-green-600 mb-1">
                        {formatDuration(improvedResult.avgDuration)}
                      </p>
                      <p className="text-xs text-green-700">n={improvedResult.count}</p>
                    </>
                  ) : (
                    <p className="text-gray-400 text-sm">データなし</p>
                  )}
                </div>
              </div>

              {badResult && improvedResult && (
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <p className="text-sm font-semibold text-blue-900 mb-1">改善効果</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {((1 - improvedResult.avgDuration / badResult.avgDuration) * 100).toFixed(1)}%
                    の時間短縮
                  </p>
                </div>
              )}
            </>
          )}

          <div className="space-y-2">
            <Link
              href="/"
              className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
            >
              トップに戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    }>
      <ResultContent />
    </Suspense>
  );
}
