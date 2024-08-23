import { Link } from 'react-router-dom'

export default function Dashboard() {

  return (
    <div>
      <h1>Dashboard page</h1>
      <p>This is a protected page.</p>

      <ul>
        <li>
          <Link to="/dashboard/profile">Profile</Link>
        </li>
        <li>
          <Link to="/">Return to index</Link>
        </li>
      </ul>
    </div>
  )
}