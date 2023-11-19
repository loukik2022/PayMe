import { Link } from 'react-router-dom';
import './cancel.css';

function Cancel({ user }) {
  return (
    <div className="cancel-container">
        <div>
            <h1 className="message">Sorry to see you cancelled your payment!</h1>
        </div>

      <Link to="/" style={{ textDecoration: 'none' }}>
        <button className="cancel-button">Go Back to Store</button>
      </Link>
    </div>
  );
}

export default Cancel;
