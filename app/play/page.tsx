'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { tasks, ROUND_COUNT } from '@/lib/tasks';
import { saveResult, getSessionId } from '@/lib/storage';
import Timer from '@/components/Timer';
import BadDeleteConfirm from '@/components/BadDeleteConfirm';
import ImprovedDeleteConfirm from '@/components/ImprovedDeleteConfirm';
import BadSort from '@/components/BadSort';
import ImprovedSort from '@/components/ImprovedSort';
import BadFilter from '@/components/BadFilter';
import ImprovedFilter from '@/components/ImprovedFilter';

type Variant = 'bad' | 'improved';

interface Round {
  taskId: string;
  variant: Variant;
}

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generateRounds(): Round[] {
  const shuffled = shuffle(tasks).slice(0, ROUND_COUNT);
  return shuffled.map((task) => ({
    taskId: task.id,
    variant: Math.random() < 0.5 ? 'bad' : 'improved',
  }));
}

function PlayContent() {
  const router = useRouter();
  const [rounds, setRounds] = useState<Round[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [sessionId, setSessionId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setRounds(generateRounds());
    setStartTime(Date.now());
    setSessionId(getSessionId());
    setIsLoading(false);
  }, []);

  const handleComplete = async () => {
    const current = rounds[currentIndex];
    const duration = Date.now() - startTime;

    try {
      await saveResult({
        taskId: current.taskId,
        variant: current.variant,
        duration,
        sessionId,
      });
    } catch (error) {
      console.error('Failed to save result:', error);
      alert('結果の保存に失敗しました。もう一度お試しください。');
      return;
    }

    if (currentIndex < rounds.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setStartTime(Date.now());
    } else {
      router.push('/result');
    }
  };

  if (isLoading || rounds.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  const current = rounds[currentIndex];
  const currentTask = tasks.find((t) => t.id === current.taskId);

  if (!currentTask) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">タスク</h2>
              <p className="text-sm text-gray-400 mt-0.5">
                {currentIndex + 1} / {rounds.length}
              </p>
            </div>
            <Timer startTime={startTime} />
          </div>
          <p className="text-gray-700 mb-8">{currentTask.description}</p>

          {current.taskId === 'delete-confirm' && current.variant === 'bad' && (
            <BadDeleteConfirm onComplete={handleComplete} />
          )}
          {current.taskId === 'delete-confirm' && current.variant === 'improved' && (
            <ImprovedDeleteConfirm onComplete={handleComplete} />
          )}
          {current.taskId === 'sort' && current.variant === 'bad' && (
            <BadSort onComplete={handleComplete} />
          )}
          {current.taskId === 'sort' && current.variant === 'improved' && (
            <ImprovedSort onComplete={handleComplete} />
          )}
          {current.taskId === 'filter' && current.variant === 'bad' && (
            <BadFilter onComplete={handleComplete} />
          )}
          {current.taskId === 'filter' && current.variant === 'improved' && (
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
