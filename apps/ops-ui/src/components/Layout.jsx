import { Outlet } from 'react-router-dom';
import Nav from './Nav';

export default function Layout() 
{
    return (
        <div style={{ fontFamily: 'Arial, sans-serif', padding: '24px' }}>
          <h1>Operations UI</h1>
          <Nav />
          <hr />
          <Outlet />
        </div>
    );
}
