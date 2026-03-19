import { Link } from 'react-router-dom';

export default function Nav()
{
    return (
        <nav style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <Link to="/">Home</Link>
            <Link to="/account_reassignment">Account Reassignment</Link>
            <Link to="/freshsuccess">Freshsuccess Backup</Link>
            <Link to="/customer_mapping">Customer Mapping</Link>
        </nav>
    );
}
