import Link from 'next/link';
import { tasks } from '@/lib/tasks';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          UI Comparison Experiment
        </h1>
        <p className="text-gray-600 mb-8">
          タスクを選んで実験を開始してください。できるだけ早く正確に完了してください。
        </p>
        <div className="space-y-3">
          {tasks.map((task) => (
            <Link
              key={task.id}
              href={`/play?task=${task.id}`}
              className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
            >
              {task.description}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
