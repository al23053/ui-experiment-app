'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { tasks } from '@/lib/tasks';
import { saveResult, getSessionId } from '@/lib/storage';
import BadForm from '@/components/BadForm';
import ImprovedForm from '@/components/ImprovedForm';
import Timer from '@/components/Timer';

type Variant = 'bad' | 'improved';

export default function PlayPage() {
  const router = useRouter();
  const [variant, setVariant] = useState<Variant | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    // ランダムにvariantを決定
    const randomVariant = Math.random() < 0.5 ? 'bad' : 'improved';
    setVariant(randomVariant);
    setStartTime(Date.now());
    setSessionId(getSessionId());
    setIsLoading(false);
  }, []);

  const handleComplete = async () => {
    if (!variant) return;

    const endTime = Date.now();
    const duration = endTime - startTime;

    try {
      await saveResult({
        taskId: tasks[0].id,
        variant,
        duration,
        sessionId,
      });

      router.push('/result');
    } catch (error) {
      console.error('Failed to save result:', error);
      alert('結果の保存に失敗しました。もう一度お試しください。');
    }
  };

  if (isLoading || !variant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  const currentTask = tasks[0];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              タスク
            </h2>
            <Timer startTime={startTime} />
          </div>
          <p className="text-gray-700 mb-6">{currentTask.description}</p>

          {variant === 'bad' ? (
            <BadForm onComplete={handleComplete} />
          ) : (
            <ImprovedForm onComplete={handleComplete} />
          )}
        </div>
      </div>
    </div>
  );
}
