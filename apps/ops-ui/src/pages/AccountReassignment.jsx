
import { useState } from 'react';

export default function AccountReassignment() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  async function previewReassignment() {
    setError('');
    setResult(null);

    try {
      const response = await fetch('http://localhost:3001/account_reassignment/preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sample: true
        })
      });

      const json = await response.json();
      setResult(json);
    } catch (err) {
      setError(err.message || 'Failed to preview reassignment');
    }
  }

  return (
    <div>
      <h2>Account Reassignment</h2>
      <button onClick={previewReassignment}>Preview Reassignment</button>
      {error ? <pre>{error}</pre> : null}
      {result ? <pre>{JSON.stringify(result, null, 2)}</pre> : null}
    </div>
  );
}