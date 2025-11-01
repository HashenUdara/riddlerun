import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { teams, checkpoints, teampath } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';

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

    // Authenticate team
    const teamResult = await db.select().from(teams).where(and(eq(teams.id, parseInt(teamID)), eq(teams.password, password))).limit(1);
    if (!teamResult || teamResult.length === 0) {
      return NextResponse.json({
        status: 400,
        desc: 'Authentication failed',
      });
    }

    // Get checkpoint details
    const checkpointResult = await db.select().from(checkpoints).where(eq(checkpoints.hash, hash)).limit(1);
    if (!checkpointResult || checkpointResult.length === 0) {
      return NextResponse.json({
        status: 400,
        desc: 'Invalid checkpoint hash',
      });
    }

    const checkpoint = checkpointResult[0];
    const checkpointID = checkpoint.id;
    const checkpointName = checkpoint.name;

    // Get team path
    const teamPathResult = await db.select().from(teampath).where(eq(teampath.teamID, parseInt(teamID))).orderBy(teampath.orderNum);
    
    if (teamPathResult.length === 0) {
      return NextResponse.json({
        status: 400,
        desc: 'Invalid team ID or password',
      });
    }

    // Check if all previous checkpoints are solved
    for (const path of teamPathResult) {
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
        await db.update(teampath)
          .set({ solved: 1, solvedTime: new Date() })
          .where(and(eq(teampath.teamID, parseInt(teamID)), eq(teampath.checkpointID, checkpointID)));

        // Update team timestamp
        await db.update(teams)
          .set({ timestamp: new Date() })
          .where(eq(teams.id, parseInt(teamID)));
      }

      // Get the next checkpoint
      const currentIndex = teamPathResult.findIndex((p) => p.checkpointID === checkpointID);
      if (currentIndex === -1 || currentIndex === teamPathResult.length - 1) {
        return NextResponse.json({
          status: 200,
          desc: 'Checkpoint solved successfully',
          riddle: 'Congratulations! You have solved all the checkpoints. Please wait for the results.',
          name: checkpointName,
        });
      }

      const nextPath = teamPathResult[currentIndex + 1];
      const nextCheckpointResult = await db.select().from(checkpoints).where(eq(checkpoints.id, nextPath.checkpointID)).limit(1);

      if (!nextCheckpointResult || nextCheckpointResult.length === 0) {
        return NextResponse.json({
          status: 200,
          desc: 'Checkpoint solved successfully',
          riddle: 'Congratulations! You have solved all the checkpoints. Please wait for the results.',
          name: checkpointName,
        });
      }

      const nextCheckpoint = nextCheckpointResult[0];

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
