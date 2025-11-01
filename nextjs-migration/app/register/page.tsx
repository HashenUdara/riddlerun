'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './register.module.css';

function RegisterContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [teamName, setTeamName] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const teamID = searchParams.get('teamID');
    const password = searchParams.get('password');

    if (!teamID || !password) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus('error');
      setMessage('Invalid registration link. Please check your credentials.');
      return;
    }

    // Register the team
    fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ teamID, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          setStatus('success');
          setTeamName(data['team-name']);
          setMessage(data.desc);
          
          // Store in localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('teamID', teamID);
            localStorage.setItem('password', password);
            localStorage.setItem('team-name', data['team-name']);
          }
        } else {
          setStatus('error');
          setMessage(data.desc || 'Something went wrong. Please try again later.');
        }
      })
      .catch(() => {
        // Check if already registered
        if (typeof window !== 'undefined' && localStorage.getItem('teamID') && localStorage.getItem('password')) {
          setStatus('success');
          setTeamName(localStorage.getItem('team-name') || '');
          setMessage('You are already registered');
        } else {
          setStatus('error');
          setMessage('Something went wrong. Please try again later.');
        }
      });
  }, [searchParams]);

  return (
    <div className={styles.main}>
      <div className={styles.mainInner}>
        {status === 'success' && (
          <div className={`${styles.confirm} ${styles.true}`}>
            <div className={styles.title}>
              Your team &quot;{teamName}&quot; has been registered successfully
            </div>
            <div className={styles.icon}>
              <i className='bx bx-check-circle bx-tada'></i>
            </div>
          </div>
        )}
        
        {status === 'error' && (
          <div className={`${styles.confirm} ${styles.false}`}>
            <div className={styles.title}>{message}</div>
            <div className={styles.icon}>
              <i className='bx bx-error-circle bx-tada'></i>
            </div>
          </div>
        )}

        {status === 'loading' && (
          <div className={styles.confirm}>
            <div className={styles.title}>Registering your team...</div>
          </div>
        )}

        <footer className={styles.footer}>
          <div className={styles.madeWithLove}>
            <div className={styles.madeWithLoveText}>
              Made with <i className='bx bxs-heart'></i> by UCSC IEEE SB Web Team
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterContent />
    </Suspense>
  );
}
