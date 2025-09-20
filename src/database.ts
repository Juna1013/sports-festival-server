import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'sports-festival.db');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS Events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    schedule_time DATETIME NOT NULL,
    location TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS Tournaments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id INTEGER NOT NULL,
    round TEXT NOT NULL,
    team_a TEXT NOT NULL,
    team_b TEXT NOT NULL,
    winner TEXT,
    FOREIGN KEY (event_id) REFERENCES Events(id)
  );
`);

const insertEvent = db.prepare(`
  INSERT OR IGNORE INTO Events (id, name, schedule_time, location)
  VALUES (?, ?, ?, ?)
`);

const insertTournament = db.prepare(`
  INSERT OR IGNORE INTO Tournaments (id, event_id, round, team_a, team_b, winner)
  VALUES (?, ?, ?, ?, ?, ?)
`);

const sampleData = [
  { id: 1, name: '運動会リレー', schedule_time: '2024-10-01 09:00:00', location: '校庭' },
  { id: 2, name: 'サッカー大会', schedule_time: '2024-10-01 10:00:00', location: 'グラウンド' },
  { id: 3, name: 'バスケットボール大会', schedule_time: '2024-10-01 11:00:00', location: '体育館' },
];

const sampleTournaments = [
  { id: 1, event_id: 1, round: '予選', team_a: '赤組', team_b: '青組', winner: null },
  { id: 2, event_id: 1, round: '準決勝', team_a: '白組', team_b: '黄組', winner: null },
  { id: 3, event_id: 2, round: '1回戦', team_a: 'チームA', team_b: 'チームB', winner: null },
  { id: 4, event_id: 2, round: '1回戦', team_a: 'チームC', team_b: 'チームD', winner: null },
  { id: 5, event_id: 3, round: '準々決勝', team_a: 'バスケA', team_b: 'バスケB', winner: null },
];

for (const event of sampleData) {
  insertEvent.run(event.id, event.name, event.schedule_time, event.location);
}

for (const tournament of sampleTournaments) {
  insertTournament.run(tournament.id, tournament.event_id, tournament.round, tournament.team_a, tournament.team_b, tournament.winner);
}

export default db;
