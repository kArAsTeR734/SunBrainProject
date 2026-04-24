export interface LeaderboardUser {
  fullName: string;
  points: number;
  position: number;
}

export interface LeaderboardDataInterface {
  topUsers: LeaderboardUser[];
  currentUser: {
    fullName: string;
    points: number;
    position: number;
  };
}

export type Leaderboard = LeaderboardDataInterface;
