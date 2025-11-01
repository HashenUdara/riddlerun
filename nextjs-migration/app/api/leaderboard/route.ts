import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { teams, teampath } from '@/lib/schema';
import { eq, sql, count, desc, asc } from 'drizzle-orm';

export async function GET() {
  try {
    // Get teams with solved checkpoints
    const solvedTeams = await db
      .select({
        id: teams.id,
        name: teams.name,
        solved: count(teampath.id).as('solved'),
        solvedTime: teams.timestamp,
      })
      .from(teams)
      .innerJoin(teampath, eq(teams.id, teampath.teamID))
      .where(eq(teampath.solved, 1))
      .groupBy(teams.id, teams.name, teams.timestamp)
      .orderBy(desc(sql`count(${teampath.id})`), asc(teams.timestamp));

    const teamIDs = solvedTeams.map((team) => team.id);
    const leaderboard = solvedTeams.map((team, index) => ({
      name: team.name,
      solved: Number(team.solved),
      solvedTime: team.solvedTime.toISOString(),
      rank: index + 1,
    }));

    let rank = leaderboard.length + 1;

    // Get teams with no solved checkpoints
    const unsolvedTeams = await db
      .select({
        id: teams.id,
        name: teams.name,
        solved: count(teampath.id).as('solved'),
        solvedTime: sql<string>`MAX(${teampath.solvedTime})::text`.as('solvedTime'),
      })
      .from(teams)
      .leftJoin(teampath, eq(teams.id, teampath.teamID))
      .where(eq(teampath.solved, 0))
      .groupBy(teams.id, teams.name)
      .orderBy(desc(sql`count(${teampath.id})`), asc(sql`MAX(${teampath.solvedTime})`));

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
