'use client';

import { useState } from 'react';

interface Props {
  onComplete: () => void;
}

const files = [
  { name: 'document.pdf', size: '2.4MB', type: 'PDF' },
  { name: 'sample.txt', size: '12KB', type: 'テキスト' },
  { name: 'photo.jpg', size: '5.1MB', type: '画像' },
  { name: 'backup.zip', size: '8.8MB', type: 'アーカイブ' },
];

export default function ImprovedDeleteConfirm({ onComplete }: Props) {
  const [deleted, setDeleted] = useState<string[]>([]);
  const [confirming, setConfirming] = useState<string | null>(null);

  const handleDeleteClick = (fileName: string) => {
    setConfirming(fileName);
  };

  const handleConfirm = () => {
    if (!confirming) return;
    setDeleted((prev) => [...prev, confirming]);
    if (confirming === 'sample.txt') {
      setConfirming(null);
      onComplete();
    } else {
      setConfirming(null);
    }
  };

  const handleCancel = () => {
    setConfirming(null);
  };

  return (
    <div className="space-y-2">
      {files.map((file) => (
        <div
          key={file.name}
          className={`flex items-center justify-between px-4 py-3 rounded-lg border transition-opacity ${
            deleted.includes(file.name)
              ? 'opacity-40 bg-gray-50 border-gray-200'
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-xs text-gray-500 font-medium">
              {file.type[0]}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{file.name}</p>
              <p className="text-xs text-gray-400">{file.size} · {file.type}</p>
            </div>
          </div>

          {deleted.includes(file.name) ? (
            <span className="text-xs text-gray-400">削除済み</span>
          ) : (
            <button
              onClick={() => handleDeleteClick(file.name)}
              className="text-sm text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded transition-colors"
            >
              削除
            </button>
          )}
        </div>
      ))}

      {/* 確認ダイアログ */}
      {confirming && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-80">
            <h3 className="text-base font-semibold text-gray-900 mb-2">
              ファイルを削除しますか？
            </h3>
            <p className="text-sm text-gray-600 mb-1">
              以下のファイルを削除します：
            </p>
            <p className="text-sm font-medium text-gray-900 bg-gray-50 px-3 py-2 rounded mb-4">
              {confirming}
            </p>
            <p className="text-xs text-gray-400 mb-6">
              この操作は取り消せません。
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
