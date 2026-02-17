'use client';

import { useState } from 'react';

interface Props {
  onComplete: () => void;
}

const files = [
  { name: 'document.pdf', size: '2.4MB' },
  { name: 'sample.txt', size: '12KB' },
  { name: 'photo.jpg', size: '5.1MB' },
  { name: 'backup.zip', size: '8.8MB' },
];

export default function BadDeleteConfirm({ onComplete }: Props) {
  const [deleted, setDeleted] = useState<string[]>([]);

  const handleDelete = (fileName: string) => {
    setDeleted((prev) => [...prev, fileName]);
    if (fileName === 'sample.txt') {
      onComplete();
    }
  };

  return (
    <div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr style={{ background: '#eee' }}>
            <th style={{ padding: '4px', textAlign: 'left' }}>name</th>
            <th style={{ padding: '4px', textAlign: 'left' }}>size</th>
            <th style={{ padding: '4px' }}>op</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr
              key={file.name}
              style={{
                opacity: deleted.includes(file.name) ? 0.3 : 1,
                borderBottom: '1px solid #ddd',
              }}
            >
              <td style={{ padding: '4px' }}>{file.name}</td>
              <td style={{ padding: '4px', color: '#999' }}>{file.size}</td>
              <td style={{ padding: '4px', textAlign: 'center' }}>
                <button
                  onClick={() => handleDelete(file.name)}
                  disabled={deleted.includes(file.name)}
                  style={{
                    background: 'red',
                    color: 'white',
                    border: 'none',
                    padding: '1px 4px',
                    fontSize: '11px',
                    cursor: deleted.includes(file.name) ? 'default' : 'pointer',
                  }}
                >
                  x
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
