import { useState } from 'react';
import { mockData } from './data/mock';
import { Dashboard } from './pages/dashboard';
import { UserProfile } from './components/userprofile';
import './App.css';

function App() {
  const [devices, setDevices] = useState(mockData.devices);
  const [logs] = useState(mockData.logs);
  const [user] = useState(mockData.users[0]);

  const deleteDevice = (id) => {
    setDevices(devices.filter(d => d.id !== id));
  };

  return (
    <div className="app-layout">
      <nav>
        <div className="logo"><strong>SmartHome</strong> OS</div>
        <UserProfile user={user} />
      </nav>
      <main>
        <Dashboard devices={devices} logs={logs} deleteDevice={deleteDevice} />
      </main>
    </div>
  );
}

export default App;