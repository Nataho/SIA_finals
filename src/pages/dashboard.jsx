import { useState } from 'react';
import { DeviceCard } from '../components/devicecard';
import { ActivityLogs } from '../components/activitylogs';

export const Dashboard = ({ devices, logs, deleteDevice }) => {
  const [filter, setFilter] = useState("");

  const filteredDevices = devices.filter(d => 
    d.type.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="dashboard">
      <section className="main-content">
        <div className="header-row">
          <h1>My Devices</h1>
          <input 
            type="text" 
            placeholder="Search by type (e.g. Lighting)..." 
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <div className="grid">
          {filteredDevices.map(d => (
            <DeviceCard key={d.id} device={d} onDelete={deleteDevice} />
          ))}
        </div>
      </section>
      <aside className="sidebar">
        <ActivityLogs logs={logs} devices={devices} />
      </aside>
    </div>
  );
};