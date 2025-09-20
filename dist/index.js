"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hono_1 = require("hono");
const cors_1 = require("hono/cors");
const node_server_1 = require("@hono/node-server");
const database_1 = __importDefault(require("./database"));
const app = new hono_1.Hono();
// CORS設定
app.use('/*', (0, cors_1.cors)({
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
        const result = await database_1.default.query('SELECT id, name, schedule_time, location FROM Events ORDER BY schedule_time');
        return c.json(result.rows);
    }
    catch (error) {
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
        const eventResult = await database_1.default.query('SELECT id, name FROM Events WHERE id = $1', [eventId]);
        if (eventResult.rows.length === 0) {
            return c.json({ error: 'Event not found' }, 404);
        }
        // トーナメント情報取得
        const tournamentResult = await database_1.default.query('SELECT id, round, team_a, team_b, winner FROM Tournaments WHERE event_id = $1 ORDER BY id', [eventId]);
        return c.json({
            event: eventResult.rows[0],
            tournaments: tournamentResult.rows
        });
    }
    catch (error) {
        console.error('Error fetching tournament:', error);
        return c.json({ error: 'Failed to fetch tournament' }, 500);
    }
});
const port = parseInt(process.env.PORT || '3001');
console.log(`Server is running on port ${port}`);
(0, node_server_1.serve)({
    fetch: app.fetch,
    port
});
