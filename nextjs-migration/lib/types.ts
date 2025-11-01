export interface Team {
  id: number;
  name: string;
  password: string;
  riddleIndex: number;
  timestamp: string;
}

export interface Checkpoint {
  id: number;
  name: string;
  hash: string;
  riddle: string;
}

export interface TeamPath {
  id: number;
  teamID: number;
  checkpointID: number;
  solved: number;
  solvedTime: string;
  orderNum: number;
}

export interface LeaderboardEntry {
  name: string;
  solved: number;
  solvedTime: string;
  rank: number;
}

export interface ApiResponse<T = unknown> {
  status: number;
  desc: string;
  data?: T;
}
