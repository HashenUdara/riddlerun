import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    interface TeamRow {
      id: number;
      name: string;
      solved: number;
      solvedTime: string;
    }

    // Get teams with solved checkpoints
    const solvedTeams = db.prepare(`
      SELECT teams.id, teams.name, COUNT(teampath.id) AS solved, teams.timestamp AS solvedTime
      FROM teams
      INNER JOIN teampath ON teams.id = teampath.teamID
      WHERE teampath.solved = ?
      GROUP BY teams.id
      ORDER BY solved DESC, solvedTime ASC
    `).all(1) as TeamRow[];

    const teamIDs = solvedTeams.map((team) => team.id);
    const leaderboard = solvedTeams.map((team, index) => ({
      name: team.name,
      solved: team.solved,
      solvedTime: team.solvedTime,
      rank: index + 1,
    }));

    let rank = leaderboard.length + 1;

    // Get teams with no solved checkpoints
    const unsolvedTeams = db.prepare(`
      SELECT teams.id, teams.name, COUNT(teampath.id) AS solved, MAX(teampath.solvedTime) AS solvedTime
      FROM teams
      LEFT JOIN teampath ON teams.id = teampath.teamID
      WHERE teampath.solved = ?
      GROUP BY teams.id
      ORDER BY solved DESC, solvedTime ASC
    `).all(0) as TeamRow[];

    for (const team of unsolvedTeams) {
      if (!teamIDs.includes(team.id)) {
        leaderboard.push({
          name: team.name,
          solved: 0,
          solvedTime: team.solvedTime,
          rank: rank++,
        });
      }
    }

    return NextResponse.json({
      status: 200,
      desc: 'Leaderboard found',
      leaderboard,
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    return NextResponse.json({
      status: 500,
      desc: 'Something went wrong. Please try again later.',
      leaderboard: [],
    });
  }
}
