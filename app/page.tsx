import Link from 'next/link';
import { ROUND_COUNT } from '@/lib/tasks';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          UI Comparison Experiment
        </h1>
        <p className="text-gray-600 mb-2">
          異なるUIで{ROUND_COUNT}つのタスクを実行します。
        </p>
        <p className="text-gray-600 mb-8">
          できるだけ早く正確に完了してください。
        </p>
        <Link
          href="/play"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Start Experiment
        </Link>
      </div>
    </div>
  );
}
