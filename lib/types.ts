export interface Tournament {
  id: number;
  name: string;
  timezone: string;
  formatType: string;
  createdAt: string;
  pointSystemId: number;
}

export interface Team {
  id: number;
  tag: string;
  name: string;
  country: string | null;
}

export interface Player {
  id: number;
  ign: string;
  pubgId: string;
  country: string | null;
  teamId: number | null;
}

// Fill these out later as needed
export interface Stage {
  id: number;
  name: string;
  tournamentId: number;
}

export interface Group {
  id: number;
  name: string;
  stageId: number;
}

export interface Match {
  id: number;
  code: string;
  stageId: number;
  groupId: number | null;
}
