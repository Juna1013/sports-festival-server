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
  // 球技種目
  { id: 1, name: 'バスケットボール', schedule_time: '2024-10-01 09:00:00', location: '体育館' },
  { id: 2, name: 'バレーボール', schedule_time: '2024-10-01 10:00:00', location: '体育館' },
  { id: 3, name: 'ソフトボール', schedule_time: '2024-10-01 11:00:00', location: 'グラウンド' },
  { id: 4, name: 'サッカー', schedule_time: '2024-10-01 13:00:00', location: 'グラウンド' },
  { id: 5, name: 'ソフトテニス', schedule_time: '2024-10-01 14:00:00', location: 'テニスコート' },

  // 競技種目
  { id: 6, name: '障害物競走', schedule_time: '2024-10-01 15:00:00', location: 'グラウンド' },
  { id: 7, name: '大リレー', schedule_time: '2024-10-01 15:30:00', location: 'グラウンド' },
  { id: 8, name: '借り人競争', schedule_time: '2024-10-01 16:00:00', location: 'グラウンド' },
  { id: 9, name: '○人×脚', schedule_time: '2024-10-01 16:30:00', location: 'グラウンド' },
  { id: 10, name: '大綱引き', schedule_time: '2024-10-01 17:00:00', location: 'グラウンド' },
  { id: 11, name: 'パン食い競争', schedule_time: '2024-10-01 17:30:00', location: 'グラウンド' },
];

const sampleTournaments = [
  // バスケットボール (event_id: 1)
  { id: 1, event_id: 1, round: '1回戦', team_a: 'バスケA', team_b: 'バスケB', winner: null },
  { id: 2, event_id: 1, round: '1回戦', team_a: 'バスケC', team_b: 'バスケD', winner: null },
  { id: 3, event_id: 1, round: '準決勝', team_a: 'TBD1', team_b: 'TBD2', winner: null },
  { id: 4, event_id: 1, round: '決勝', team_a: 'TBD', team_b: 'TBD', winner: null },

  // バレーボール (event_id: 2)
  { id: 5, event_id: 2, round: '1回戦', team_a: 'バレーA', team_b: 'バレーB', winner: null },
  { id: 6, event_id: 2, round: '1回戦', team_a: 'バレーC', team_b: 'バレーD', winner: null },
  { id: 7, event_id: 2, round: '準決勝', team_a: 'TBD1', team_b: 'TBD2', winner: null },
  { id: 8, event_id: 2, round: '決勝', team_a: 'TBD', team_b: 'TBD', winner: null },

  // ソフトボール (event_id: 3)
  { id: 9, event_id: 3, round: '1回戦', team_a: 'ソフトA', team_b: 'ソフトB', winner: null },
  { id: 10, event_id: 3, round: '1回戦', team_a: 'ソフトC', team_b: 'ソフトD', winner: null },
  { id: 11, event_id: 3, round: '準決勝', team_a: 'TBD1', team_b: 'TBD2', winner: null },
  { id: 12, event_id: 3, round: '決勝', team_a: 'TBD', team_b: 'TBD', winner: null },

  // サッカー (event_id: 4)
  { id: 13, event_id: 4, round: '1回戦', team_a: 'サッカーA', team_b: 'サッカーB', winner: null },
  { id: 14, event_id: 4, round: '1回戦', team_a: 'サッカーC', team_b: 'サッカーD', winner: null },
  { id: 15, event_id: 4, round: '準決勝', team_a: 'TBD1', team_b: 'TBD2', winner: null },
  { id: 16, event_id: 4, round: '決勝', team_a: 'TBD', team_b: 'TBD', winner: null },

  // ソフトテニス (event_id: 5)
  { id: 17, event_id: 5, round: '1回戦', team_a: 'テニスA', team_b: 'テニスB', winner: null },
  { id: 18, event_id: 5, round: '1回戦', team_a: 'テニスC', team_b: 'テニスD', winner: null },
  { id: 19, event_id: 5, round: '準決勝', team_a: 'TBD1', team_b: 'TBD2', winner: null },
  { id: 20, event_id: 5, round: '決勝', team_a: 'TBD', team_b: 'TBD', winner: null },

  // 障害物競走 (event_id: 6)
  { id: 21, event_id: 6, round: '予選1組', team_a: '1年A組', team_b: '1年B組', winner: null },
  { id: 22, event_id: 6, round: '予選2組', team_a: '2年A組', team_b: '2年B組', winner: null },
  { id: 23, event_id: 6, round: '予選3組', team_a: '3年A組', team_b: '3年B組', winner: null },
  { id: 24, event_id: 6, round: '決勝', team_a: 'TBD1', team_b: 'TBD2', winner: null },

  // 大リレー (event_id: 7)
  { id: 25, event_id: 7, round: '予選1組', team_a: '赤組', team_b: '青組', winner: null },
  { id: 26, event_id: 7, round: '予選2組', team_a: '白組', team_b: '黄組', winner: null },
  { id: 27, event_id: 7, round: '決勝', team_a: 'TBD1', team_b: 'TBD2', winner: null },

  // 借り人競争 (event_id: 8)
  { id: 28, event_id: 8, round: '1回戦', team_a: '低学年チーム', team_b: '高学年チーム', winner: null },
  { id: 29, event_id: 8, round: '決勝', team_a: 'TBD', team_b: '先生チーム', winner: null },

  // ○人×脚 (event_id: 9)
  { id: 30, event_id: 9, round: '予選1組', team_a: '5人6脚A', team_b: '5人6脚B', winner: null },
  { id: 31, event_id: 9, round: '予選2組', team_a: '5人6脚C', team_b: '5人6脚D', winner: null },
  { id: 32, event_id: 9, round: '決勝', team_a: 'TBD1', team_b: 'TBD2', winner: null },

  // 大綱引き (event_id: 10)
  { id: 33, event_id: 10, round: '1回戦', team_a: '東軍', team_b: '西軍', winner: null },
  { id: 34, event_id: 10, round: '決勝', team_a: 'TBD', team_b: '南軍', winner: null },

  // パン食い競争 (event_id: 11)
  { id: 35, event_id: 11, round: '予選1組', team_a: '子供チーム', team_b: '大人チーム', winner: null },
  { id: 36, event_id: 11, round: '予選2組', team_a: '保護者チーム', team_b: '教員チーム', winner: null },
  { id: 37, event_id: 11, round: '決勝', team_a: 'TBD1', team_b: 'TBD2', winner: null },
];

for (const event of sampleData) {
  insertEvent.run(event.id, event.name, event.schedule_time, event.location);
}

for (const tournament of sampleTournaments) {
  insertTournament.run(tournament.id, tournament.event_id, tournament.round, tournament.team_a, tournament.team_b, tournament.winner);
}

export default db;
