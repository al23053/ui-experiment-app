'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAggregatedResults, type AggregatedResult } from '@/lib/storage';
import { tasks } from '@/lib/tasks';

export default function ResultPage() {
  const [results, setResults] = useState<AggregatedResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await getAggregatedResults(tasks[0].id);
        setResults(data);
      } catch (error) {
        console.error('Failed to fetch results:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, []);

  const formatDuration = (ms: number) => {
    return `${(ms / 1000).toFixed(2)}s`;
  };

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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            実験結果
          </h1>
          <p className="text-gray-600 mb-8">
            全ユーザーの集計結果
          </p>

          {results.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">
                まだデータがありません
              </p>
              <p className="text-sm text-gray-400">
                あなたが最初の参加者です！
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-red-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-red-900 mb-2">
                    Bad UI
                  </h3>
                  {badResult ? (
                    <>
                      <p className="text-4xl font-bold text-red-600 mb-2">
                        {formatDuration(badResult.avgDuration)}
                      </p>
                      <p className="text-sm text-red-700">
                        平均所要時間（n={badResult.count}）
                      </p>
                    </>
                  ) : (
                    <p className="text-gray-500">データなし</p>
                  )}
                </div>

                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-900 mb-2">
                    Improved UI
                  </h3>
                  {improvedResult ? (
                    <>
                      <p className="text-4xl font-bold text-green-600 mb-2">
                        {formatDuration(improvedResult.avgDuration)}
                      </p>
                      <p className="text-sm text-green-700">
                        平均所要時間（n={improvedResult.count}）
                      </p>
                    </>
                  ) : (
                    <p className="text-gray-500">データなし</p>
                  )}
                </div>
              </div>

              {badResult && improvedResult && (
                <div className="bg-blue-50 p-4 rounded-lg mb-8">
                  <h3 className="text-sm font-semibold text-blue-900 mb-2">
                    改善効果
                  </h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {((1 - improvedResult.avgDuration / badResult.avgDuration) * 100).toFixed(1)}%
                    の時間短縮
                  </p>
                </div>
              )}
            </>
          )}

          <div className="mt-8 text-center space-x-4">
            <Link
              href="/"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              もう一度実験する
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
