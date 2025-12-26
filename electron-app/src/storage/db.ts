import Dexie, { Table } from 'dexie';

export interface Space {
  id: number;
  [key: string]: any;
}

export interface User {
  id: number;
  [key: string]: any;
}

export interface Flow {
  id: number;
  space_id: number;
  [key: string]: any;
}

export interface SpaceMember {
  id: number;
  space_id: number;
  [key: string]: any;
}

export interface FlowMember {
  id: number;
  flow_id: number;
  [key: string]: any;
}

export class WorkspaceDB extends Dexie {
  spaces!: Table<Space, number>;
  users!: Table<User, number>;
  flows!: Table<Flow, number>;
  spaceMembers!: Table<SpaceMember, number>;
  flowMembers!: Table<FlowMember, number>;

  constructor() {
    super('workspace-db');
    this.version(3).stores({
      spaces: 'id',
      users: 'id, email',
      flows: 'id, space_id',
      spaceMembers: 'id, space_id',
      flowMembers: 'id, flow_id'
    });
  }
}

export const db = new WorkspaceDB();
