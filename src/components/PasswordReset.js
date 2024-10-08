import React from 'react';
import '../styles/PasswordReset.css'; // Import your custom CSS
import { Link } from 'react-router-dom';
import { auth } from '../Firebase/firebase-config';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function PasswordReset() {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailVal = e.target.emailForPass.value;

    try {
      await sendPasswordResetEmail(auth, emailVal);
      navigate('/login');
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="password-reset">
      <div className="password-container">
        <div className="center-row">
          <div className="custom-column">
            <div className="forgot-password">
              <h2>Forgot your password?</h2>
              <p>Change your password in three easy steps. This will help you secure your password!</p>
              <ol className="list-unstyled">
                <li><span className="list-text"></span>Enter your email address below.</li>
                <li><span className="list-text"></span>Our system will send you a temporary link.</li>
                <li><span className="list-text"></span>Use the link to reset your password.</li>
              </ol>
            </div>

            <form className="card my-4" onSubmit={(e) => handleSubmit(e)}>
              <div className="card-body">
                <div className="form-group">
                  <label htmlFor="emailForPass">Enter your email address</label><br/>
                  <input className="form-control" type="email" id="emailForPass" required /><br/>
                  <small className="form-text text-muted">Enter the email address you used during registration on VitaTrack. We will email a link to this address.</small>
                </div>
              </div>
              <div className="card-footer">
                <button className="btn-reset btn-success" type="submit">Get New Password</button>
                <Link to="/login">
                  <button className="btn-reset btn-danger">Back to Login</button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PasswordReset;