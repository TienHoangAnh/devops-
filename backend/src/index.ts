import app from './app.js';
import { config } from './config/index.js';
import { connectPrisma, prisma } from './lib/prisma.js';

async function main() {
  try {
    const connected = await connectPrisma();
    if (connected) {
      console.log('Database connected');
    } else {
      console.log('Server running in fallback mode without database');
    }

    app.listen(config.port, () => {
      console.log(`Server running on http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

main();

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
