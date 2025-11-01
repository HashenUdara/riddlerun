import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { hash, teamID, password } = body;

    if (!hash || !teamID || !password) {
      return NextResponse.json({
        status: 400,
        desc: 'Please fill all the required input fields',
      });
    }

    interface TeamRow {
      id: number;
      name: string;
      password: string;
      riddleIndex: number;
      timestamp: string;
    }

    interface CheckpointRow {
      id: number;
      name: string;
      hash: string;
      riddle: string;
    }

    interface TeamPathRow {
      id: number;
      teamID: number;
      checkpointID: number;
      solved: number;
      solvedTime: string;
      orderNum: number;
    }

    // Authenticate team
    const team = db.prepare('SELECT * FROM teams WHERE id = ? AND password = ?').get(teamID, password) as TeamRow | undefined;
    if (!team) {
      return NextResponse.json({
        status: 400,
        desc: 'Authentication failed',
      });
    }

    // Get checkpoint details
    const checkpoint = db.prepare('SELECT * FROM checkpoints WHERE hash = ?').get(hash) as CheckpointRow | undefined;
    if (!checkpoint) {
      return NextResponse.json({
        status: 400,
        desc: 'Invalid checkpoint hash',
      });
    }

    const checkpointID = checkpoint.id;
    const checkpointName = checkpoint.name;

    // Get team path
    const teamPath = db.prepare('SELECT * FROM teampath WHERE teamID = ? ORDER BY orderNum ASC').all(teamID) as TeamPathRow[];
    
    if (teamPath.length === 0) {
      return NextResponse.json({
        status: 400,
        desc: 'Invalid team ID or password',
      });
    }

    // Check if all previous checkpoints are solved
    for (const path of teamPath) {
      if (path.solved === 0 && path.checkpointID !== checkpointID) {
        return NextResponse.json({
          status: 400,
          desc: 'Please solve the previous checkpoints first',
        });
      }

      if (path.checkpointID !== checkpointID) {
        continue;
      }

      // Update the checkpoint if not solved
      if (path.solved === 0) {
        const updateStmt = db.prepare('UPDATE teampath SET solved = 1, solvedTime = datetime("now") WHERE teamID = ? AND checkpointID = ?');
        updateStmt.run(teamID, checkpointID);

        // Update team timestamp
        const updateTeamStmt = db.prepare('UPDATE teams SET timestamp = datetime("now") WHERE id = ?');
        updateTeamStmt.run(teamID);
      }

      // Get the next checkpoint
      const currentIndex = teamPath.findIndex((p) => p.checkpointID === checkpointID);
      if (currentIndex === -1 || currentIndex === teamPath.length - 1) {
        return NextResponse.json({
          status: 200,
          desc: 'Checkpoint solved successfully',
          riddle: 'Congratulations! You have solved all the checkpoints. Please wait for the results.',
          name: checkpointName,
        });
      }

      const nextPath = teamPath[currentIndex + 1];
      const nextCheckpoint = db.prepare('SELECT * FROM checkpoints WHERE id = ?').get(nextPath.checkpointID) as CheckpointRow | undefined;

      if (!nextCheckpoint) {
        return NextResponse.json({
          status: 200,
          desc: 'Checkpoint solved successfully',
          riddle: 'Congratulations! You have solved all the checkpoints. Please wait for the results.',
          name: checkpointName,
        });
      }

      return NextResponse.json({
        status: 200,
        desc: 'Checkpoint solved successfully',
        riddle: nextCheckpoint.riddle,
        name: checkpointName,
      });
    }

    return NextResponse.json({
      status: 400,
      desc: 'Checkpoint not found in your path',
    });
  } catch (error) {
    console.error('Check-in error:', error);
    return NextResponse.json({
      status: 500,
      desc: 'Something went wrong. Please try again later.',
    });
  }
}
