import { nhost } from '../App';

const Dashboard = () => {
  const handleLogout = async () => {
    await nhost.auth.signOut();
  };

  return (
    <div>
      <h1>Welcome to the Dashboard!</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
