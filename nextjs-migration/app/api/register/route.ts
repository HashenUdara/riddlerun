import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { teamID, password } = body;

    if (!teamID || !password) {
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

    // Query the database to verify team credentials
    const team = db.prepare('SELECT * FROM teams WHERE id = ? AND password = ?').get(teamID, password) as TeamRow | undefined;

    if (!team) {
      return NextResponse.json({
        status: 400,
        desc: 'Invalid team ID or password',
      });
    }

    return NextResponse.json({
      status: 200,
      desc: 'Team registered successfully',
      'team-name': team.name,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({
      status: 500,
      desc: 'Something went wrong. Please try again later.',
    });
  }
}
