import { createServer } from '../server.mjs';
// Réutilise exactement les routes testées localement, sans ouvrir de port sur Vercel.
const handler = createServer().listeners('request')[0];
export default handler;
