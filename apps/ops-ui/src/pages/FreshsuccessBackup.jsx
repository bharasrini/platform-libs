import { useState } from 'react';

export default function FreshsuccessBackup() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  async function runBackup() {
    setError('');
    setResult(null);

    try {
      const response = await fetch('http://localhost:3001/freshsuccess/backup', {
        method: 'POST'
      });
      const json = await response.json();
      setResult(json);
    } catch (err) {
      setError(err.message || 'Failed to run backup');
    }
  }

  return (
    <div>
      <h2>Freshsuccess Backup</h2>
      <button onClick={runBackup}>Run Backup</button>
      {error ? <pre>{error}</pre> : null}
      {result ? <pre>{JSON.stringify(result, null, 2)}</pre> : null}
    </div>
  );
}