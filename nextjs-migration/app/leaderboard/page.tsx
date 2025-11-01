'use client';

import { useEffect, useState } from 'react';
import styles from './leaderboard.module.css';

interface LeaderboardEntry {
  name: string;
  solved: number;
  solvedTime: string;
  rank: number;
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch('/api/leaderboard');
        const data = await res.json();
        
        if (data.status === 200) {
          setLeaderboard(data.leaderboard);
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    };

    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 5000);
    return () => clearInterval(interval);
  }, []);

  const dateTimeToScore = (dateTimeStr: string) => {
    const epoch = new Date("2024-01-01T00:00:00Z");
    const date = new Date(dateTimeStr);
    const diffMs = date.getTime() - epoch.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    return diffMinutes;
  };

  return (
    <>
      <div className={styles.fixedBg}></div>
      <div className={styles.main}>
        <div className={`${styles.mainInner} ${styles.hideScrollbar}`}>
          <div className={styles.leaderboard}>
            <div className={styles.leaderboardTitle}>
              <h1>Leaderboard</h1>
            </div>
            <div className={styles.leaderboardTable}>
              <table>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Team</th>
                    <th>Checkpoints</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, index) => (
                    <tr key={index}>
                      <td>{entry.rank}</td>
                      <td>{entry.name}</td>
                      <td>{entry.solved}</td>
                      <td>{dateTimeToScore(entry.solvedTime)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <footer className={styles.footer}>
            <div className={styles.madeWithLove}>
              <div className={styles.madeWithLoveText}>
                Made with <i className='bx bxs-heart'></i> by UCSC IEEE SB Web Team
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
