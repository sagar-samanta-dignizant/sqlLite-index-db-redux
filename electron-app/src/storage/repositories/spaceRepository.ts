import { createPlatformRepository } from '../utils';
import { db } from '../db';

interface SpaceRepository {
  getAll(): Promise<any>;
  save(spaces: any[]): Promise<any>;
  clear(): Promise<void>;
}

const electronSpaceRepository: SpaceRepository = {
  async getAll() {
    return await window.electronAPI.getSpaces();
  },
  async save(spaces: any[]) {
    return await window.electronAPI.saveSpaces(spaces);
  },
  async clear() {
    await window.electronAPI.clearSpaces();
  }
};

// Web Worker Helper
const worker = new Worker(new URL('../workers/transform.worker.ts', import.meta.url), { type: 'module' });

function runWorkerTask(type: 'SHRED' | 'STITCH', payload: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const id = Math.random().toString(36).substring(7);
    
    const handler = (e: MessageEvent) => {
      if (e.data.id === id) {
        worker.removeEventListener('message', handler);
        if (e.data.type === 'SUCCESS') {
          resolve(e.data.payload);
        } else {
          reject(new Error(e.data.error));
        }
      }
    };
    
    worker.addEventListener('message', handler);
    worker.postMessage({ type, payload, id });
  });
}

const webSpaceRepository: SpaceRepository = {
  async getAll() {
    // 1. Fetch all raw data (Fast IO)
    const [spaces, spaceMembers, flows, flowMembers] = await Promise.all([
      db.spaces.toArray(),
      db.spaceMembers.toArray(),
      db.flows.toArray(),
      db.flowMembers.toArray()
    ]);

    // 2. Offload CPU-intensive stitching to Worker
    return runWorkerTask('STITCH', { spaces, flows, spaceMembers, flowMembers });
  },

  async save(spaceData: any[]) {
    // 1. Offload CPU-intensive shredding to Worker
    const { spaces, flows, spaceMembers, flowMembers } = await runWorkerTask('SHRED', spaceData);
    
    // 2. Bulk Write (Fast IO)
    await db.transaction('rw', db.spaces, db.flows, db.spaceMembers, db.flowMembers, async () => {
        await db.spaces.clear();
        await db.flows.clear();
        await db.spaceMembers.clear();
        await db.flowMembers.clear();

        if (spaces.length > 0) await db.spaces.bulkPut(spaces);
        if (spaceMembers.length > 0) await db.spaceMembers.bulkPut(spaceMembers);
        if (flows.length > 0) await db.flows.bulkPut(flows);
        if (flowMembers.length > 0) await db.flowMembers.bulkPut(flowMembers);
    });

    return this.getAll();
  },

  async clear() {
    await db.transaction('rw', db.spaces, db.flows, db.spaceMembers, db.flowMembers, async () => {
        await db.spaces.clear();
        await db.flows.clear();
        await db.spaceMembers.clear();
        await db.flowMembers.clear();
    });
  }
};

export const spaceRepository = createPlatformRepository(electronSpaceRepository, webSpaceRepository);
