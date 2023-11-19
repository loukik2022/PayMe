import { Link } from 'react-router-dom';
import './Success.css';

function Success({ user }) {
  return (
    <div className="success-container">
        <div>
          <h1 className="message">Thank you for your purchase!</h1>
        </div>

      <Link to="/" style={{ textDecoration: 'none' }}>
        <button className="success-button">Continue Shopping</button>
      </Link>
    </div>
  );
}

export default Success;