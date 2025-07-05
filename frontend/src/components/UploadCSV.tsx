import React, { useState } from 'react';

const UploadCSV = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:3000/scores/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setMessage(data.message || 'Uploaded!');
    } catch (err) {
      setMessage('Upload failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded shadow">
      <input
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-2"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Upload CSV
      </button>
      <p className="mt-2 text-green-600">{message}</p>
    </form>
  );
};

export default UploadCSV;
