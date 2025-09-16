import db from '@repo/db/db';
import { Domain } from '@repo/db/Domain';

async function init() {
  const database = await db();
  const data = await database.manager.find(Domain);
  console.log(data);
}

(async () => {
  init();
})();
