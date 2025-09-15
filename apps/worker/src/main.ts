import db from '@repo/db/db';
import { Domain } from '@repo/db/Domain';

async function init() {
  await db.initialize();
  const data = await db.manager.find(Domain);
  console.log(data);
}

(async () => {
  init();
})();
