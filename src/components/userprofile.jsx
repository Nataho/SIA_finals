export const UserProfile = ({ user }) => (
  <div className="user-profile">
    <div className="avatar">{user.avatar}</div>
    <div>
      <p className="user-name">{user.name}</p>
      <p className="user-role">{user.role}</p>
    </div>
  </div>
);