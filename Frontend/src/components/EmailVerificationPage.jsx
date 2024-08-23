import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './EmailVerificationPage.css'; // Ensure this file is styled accordingly

const EmailVerificationPage = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      if (!token) {
        setMessage('Token not found in the URL.');
        setIsSuccess(false);
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api-v1/auth/verify-email', null, { params: { token } });
        if (response.data.success) {
          setMessage('You have successfully verified your account.');
          setIsSuccess(true);
        } else {
          setMessage('Email verification failed. The link may have expired or is invalid.');
          setIsSuccess(false);
        }
      } catch (error) {
        setMessage(error.response?.data?.message || 'Email verification failed. The link may have expired or is invalid.');
        setIsSuccess(false);
      } finally {
        setIsLoading(false);
      }
    };
    verifyEmail();
  }, [searchParams]);

  return (
    <div className="EmailVerificationPage">
      <div className={`message-card ${isSuccess ? 'success' : 'error'}`}>
        {isLoading ? (
          <div className="loader"></div>
        ) : (
          <>
            <h3>{message}</h3>
            {isSuccess ? (
              <button className="redirect-button" onClick={() => navigate('/teacher-login')}>Ok</button>
            ) : (
              <div className="retry-message">
                <p>Please try verifying your email again or contact support for assistance.</p>
                <button className="retry-button" onClick={() => navigate('/')}>Go to Home</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EmailVerificationPage;
