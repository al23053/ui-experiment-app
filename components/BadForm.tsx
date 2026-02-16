'use client';

import { useState } from 'react';

interface BadFormProps {
  onComplete: () => void;
}

export default function BadForm({ onComplete }: BadFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email) {
      setError('エラー');
      return;
    }

    if (!email.includes('@')) {
      setError('エラー');
      return;
    }

    onComplete();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <input
        type="text"
        placeholder="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
      />

      <input
        type="text"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
      />

      <button
        type="submit"
        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
      >
        送信
      </button>
    </form>
  );
}
