/*
import { useState } from 'react';

export default function App() 
{
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function checkApi()
    {
        setLoading(true);
        setError('');

        try 
        {
            const response = await fetch('http://localhost:3001/health');
            const json = await response.json();
            setData(json);
        }
        catch (err)
        {
        setError(err.message || 'Failed to call API');
        }
        finally
        {
        setLoading(false);
        }
    }

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', padding: '24px' }}>
        <h1>Operations UI</h1>
        <p>First starter app for internal tools.</p>

        <button onClick={checkApi} disabled={loading}>
            {loading ? 'Checking...' : 'Check API'}
        </button>

        {error ? <pre>{error}</pre> : null}
        {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : null}
        </div>
    );
}
*/


import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import AccountReassignment from './pages/AccountReassignment';
import FreshsuccessBackup from './pages/FreshsuccessBackup';
import CustomerMapping from './pages/CustomerMapping';

export default function App() 
{
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="account_reassignment" element={<AccountReassignment />} />
                <Route path="freshsuccess" element={<FreshsuccessBackup />} />
                <Route path="customer_mapping" element={<CustomerMapping />} />
            </Route>
        </Routes>
    );
} 