export const ActivityLogs = ({ logs, devices }) => (
  <div className="log-container">
    <h3>Recent Activity</h3>
    {logs.map(log => {
      const device = devices.find(d => d.id === log.deviceId);
      return (
        <div key={log.id} className="log-item">
          <span className="time">{log.timestamp}</span>
          <p><strong>{device?.name || "Unknown"}</strong>: {log.action}</p>
        </div>
      );
    })}
  </div>
);