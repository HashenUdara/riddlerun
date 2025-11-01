'use client';

import { useEffect, useState, Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './check-in.module.css';

function CheckInContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [riddle, setRiddle] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const hash = searchParams.get('hash');
    const teamID = typeof window !== 'undefined' ? localStorage.getItem('teamID') : null;
    const password = typeof window !== 'undefined' ? localStorage.getItem('password') : null;

    if (!teamID || !password) {
      setStatus('error');
      setMessage('You are not registered to the event. Please register first.');
      return;
    }

    if (!hash) {
      setStatus('error');
      setMessage('Invalid check-in link.');
      return;
    }

    // Check in at the checkpoint
    fetch('/api/check-in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ hash, teamID, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          setStatus('success');
          setRiddle(data.riddle);
          setMessage(data.desc);
        } else {
          setStatus('error');
          setMessage(data.desc || 'Something went wrong. Please try again later.');
        }
      })
      .catch(() => {
        setStatus('error');
        setMessage('Something went wrong. Please try again later.');
      });
  }, [searchParams]);

  const authorNames = ["Loku Cir", "දිනූගෙ යාලුවෙක්", "Some Dude", "Definitely Not Einstein", "The Riddle Master", "The Enigma Writer", "The Puzzle Pro", "The Cryptographer", "The Conundrum Creator", "The Brain Teaser Baron", "The Mystery Maker", "The Puzzler Extraordinaire"];
  // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/purity
  const randomAuthor = useMemo(() => authorNames[Math.floor(Math.random() * authorNames.length)], []);

  return (
    <div className={styles.main}>
      <div className={styles.mainInner}>
        {status === 'success' && (
          <div className={`${styles.confirm} ${styles.true}`}>
            <div className={styles.title}>
              <div className={styles.riddleWrapper}>
                <blockquote 
                  className={styles.riddle}
                  dangerouslySetInnerHTML={{ __html: riddle }}
                />
                <cite className={styles.author}>{randomAuthor}</cite>
              </div>
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
            <div className={styles.title}>Processing check-in...</div>
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

export default function CheckInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckInContent />
    </Suspense>
  );
}
