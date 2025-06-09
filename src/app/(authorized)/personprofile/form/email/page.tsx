// components/EmailForm.tsx
'use client'; // if you're using App Router

import { useState } from 'react';

export default function EmailForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    let first_name = "Juan";
    const res = await fetch('/api/send-email', {
      method: 'POST',
      body: JSON.stringify({ first_name, email }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();
    setStatus(data.message || 'Done!');
  };

  return (
    <form onSubmit={sendEmail} className="space-y-4 max-w-sm mx-auto">
      <input
        type="email"
        value={email}
        required
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded"
        placeholder="Recipient email"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Send Email
      </button>
      {status && <p className="text-green-600">{status}</p>}
    </form>
  );
}
