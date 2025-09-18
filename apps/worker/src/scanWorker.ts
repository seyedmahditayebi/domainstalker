import { SandboxedJob } from 'bullmq';
import { spawnSync } from 'child_process';
import { dayjsExtended } from './dayjsExtended';

module.exports = async (job: SandboxedJob) => {
  const started_at = dayjsExtended();
  const result = spawnSync('subfinder', ['-d', job.data.name, '-silent'], {
    shell: false,
    encoding: 'utf8',
  });
  if (result.status === 0) {
    const finished_at = dayjsExtended();
    return { discovered_subdomains: result.stdout, started_at, finished_at };
  }
};
