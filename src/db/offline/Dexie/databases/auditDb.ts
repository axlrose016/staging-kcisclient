import Dexie, { Table } from 'dexie';

declare module 'dexie' {
  interface Transaction {
    meta?: {
      needsAudit?: boolean;
    };
  }
}

export interface AuditTrail {
  id: string;
  module: string;
  transacted_by: string;
  table: string;
  operation: 'create' | 'update' | 'delete';
  timestamp: string;
  primaryKey?: any;
  oldValue?: any;
  newValue?: any;
}

export class AuditDatabase extends Dexie {
  auditTrail!: Table<AuditTrail, string>;

  constructor() {
    super('auditDb');

    this.version(1).stores({
      auditTrail: 'id, module, transacted_by, table, operation, timestamp, primaryKey, oldValue, newValue'
    });
  }
}

export const auditDb = new AuditDatabase();
