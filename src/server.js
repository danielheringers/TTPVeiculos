import { app } from "./app.js";
import "dotenv/config.js";
import { startDatabase, closeDatabase } from "./database/database.js";

export const server = app.listen(3000, async () => {
  await startDatabase();
});

export const closeServerAndDatabase = async () => {
  await closeDatabase();

  return new Promise((resolve) => {
    server.close((err) => {
      if (err) {
        console.error('Error closing server:', err);
      } else {
      }
      resolve();
    });
  });
};
