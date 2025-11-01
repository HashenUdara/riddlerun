import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';

// Teams table
export const teams = pgTable('teams', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  password: text('password').notNull(),
  riddleIndex: integer('riddleIndex').notNull().default(1),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
});

// Checkpoints table
export const checkpoints = pgTable('checkpoints', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  hash: text('hash').notNull(),
  riddle: text('riddle').notNull(),
});

// Teampath table
export const teampath = pgTable('teampath', {
  id: serial('id').primaryKey(),
  teamID: integer('teamID').notNull().references(() => teams.id),
  checkpointID: integer('checkpointID').notNull().references(() => checkpoints.id),
  solved: integer('solved').notNull().default(0),
  solvedTime: timestamp('solvedTime').defaultNow().notNull(),
  orderNum: integer('orderNum').notNull(),
});
