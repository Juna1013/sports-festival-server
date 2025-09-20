import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';
import db from './database';

const app = new Hono();

// CORS設定
app.use('/*', cors({
  origin: ['http://localhost:3000', 'https://*.vercel.app'],
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// ヘルスチェック
app.get('/', (c) => {
  return c.json({ message: 'Sports Festival API is running!' });
});

// 全競技スケジュール取得
app.get('/events', async (c) => {
  try {
    const stmt = db.prepare('SELECT id, name, schedule_time, location FROM Events ORDER BY schedule_time');
    const events = stmt.all();
    return c.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return c.json({ error: 'Failed to fetch events' }, 500);
  }
});

// 指定競技のトーナメント取得
app.get('/tournaments/:eventId', async (c) => {
  try {
    const eventId = parseInt(c.req.param('eventId'));

    if (isNaN(eventId)) {
      return c.json({ error: 'Invalid event ID' }, 400);
    }

    // 競技情報取得
    const eventStmt = db.prepare('SELECT id, name FROM Events WHERE id = ?');
    const event = eventStmt.get(eventId);

    if (!event) {
      return c.json({ error: 'Event not found' }, 404);
    }

    // トーナメント情報取得
    const tournamentStmt = db.prepare('SELECT id, round, team_a, team_b, winner FROM Tournaments WHERE event_id = ? ORDER BY id');
    const tournaments = tournamentStmt.all(eventId);

    return c.json({
      event,
      tournaments
    });
  } catch (error) {
    console.error('Error fetching tournament:', error);
    return c.json({ error: 'Failed to fetch tournament' }, 500);
  }
});

const port = parseInt(process.env.PORT || '3001');

console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port
});
