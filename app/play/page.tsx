'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { tasks } from '@/lib/tasks';
import { saveResult, getSessionId } from '@/lib/storage';
import Timer from '@/components/Timer';
import BadDeleteConfirm from '@/components/BadDeleteConfirm';
import ImprovedDeleteConfirm from '@/components/ImprovedDeleteConfirm';
import BadSort from '@/components/BadSort';
import ImprovedSort from '@/components/ImprovedSort';
import BadFilter from '@/components/BadFilter';
import ImprovedFilter from '@/components/ImprovedFilter';

type Variant = 'bad' | 'improved';

function PlayContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const taskId = searchParams.get('task');

  const [variant, setVariant] = useState<Variant | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string>('');

  const currentTask = tasks.find((t) => t.id === taskId);

  useEffect(() => {
    if (!currentTask) {
      router.push('/');
      return;
    }
    const randomVariant: Variant = Math.random() < 0.5 ? 'bad' : 'improved';
    setVariant(randomVariant);
    setStartTime(Date.now());
    setSessionId(getSessionId());
    setIsLoading(false);
  }, [currentTask, router]);

  const handleComplete = async () => {
    if (!variant || !currentTask) return;

    const duration = Date.now() - startTime;

    try {
      await saveResult({
        taskId: currentTask.id,
        variant,
        duration,
        sessionId,
      });
      router.push(`/result?task=${currentTask.id}`);
    } catch (error) {
      console.error('Failed to save result:', error);
      alert('結果の保存に失敗しました。もう一度お試しください。');
    }
  };

  if (isLoading || !variant || !currentTask) {
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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">タスク</h2>
            <Timer startTime={startTime} />
          </div>
          <p className="text-gray-700 mb-8">{currentTask.description}</p>

          {taskId === 'delete-confirm' && variant === 'bad' && (
            <BadDeleteConfirm onComplete={handleComplete} />
          )}
          {taskId === 'delete-confirm' && variant === 'improved' && (
            <ImprovedDeleteConfirm onComplete={handleComplete} />
          )}
          {taskId === 'sort' && variant === 'bad' && (
            <BadSort onComplete={handleComplete} />
          )}
          {taskId === 'sort' && variant === 'improved' && (
            <ImprovedSort onComplete={handleComplete} />
          )}
          {taskId === 'filter' && variant === 'bad' && (
            <BadFilter onComplete={handleComplete} />
          )}
          {taskId === 'filter' && variant === 'improved' && (
            <ImprovedFilter onComplete={handleComplete} />
          )}
        </div>
      </div>
    </div>
  );
}

export default function PlayPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-gray-600">Loading...</div>
        </div>
      }
    >
      <PlayContent />
    </Suspense>
  );
}