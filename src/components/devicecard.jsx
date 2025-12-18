export const DeviceCard = ({ device, onDelete }) => (
  <div className="card device-card">
    <div className="device-info">
      <h4>{device.name}</h4>
      <span className="badge">{device.type}</span>
    </div>
    <p>Status: <strong>{device.status}</strong></p>
    <div className="card-actions">
      <button className="btn-delete" onClick={() => onDelete(device.id)}>Remove</button>
    </div>
  </div>
);