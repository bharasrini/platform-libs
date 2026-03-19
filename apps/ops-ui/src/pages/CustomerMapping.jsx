
import { useState } from 'react';

export default function CustomerMapping() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  async function validateMapping() {
    setError('');
    setResult(null);

    try {
      const response = await fetch('http://localhost:3001/customer_mapping/validate');
      const json = await response.json();
      setResult(json);
    } catch (err) {
      setError(err.message || 'Failed to validate mapping');
    }
  }

  return (
    <div>
      <h2>Customer Mapping</h2>
      <button onClick={validateMapping}>Validate Mapping</button>
      {error ? <pre>{error}</pre> : null}
      {result ? <pre>{JSON.stringify(result, null, 2)}</pre> : null}
    </div>
  );
}