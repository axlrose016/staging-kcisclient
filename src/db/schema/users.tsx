import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { modules, permissions, roles } from "./libraries";

export const users = sqliteTable('users',{
  id: text('id').notNull().primaryKey(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role_id: text('role_id').notNull().references(() => roles.id),
  created_date: text('created_date').default(sql`CURRENT_TIMESTAMP`).notNull(),
  created_by: text('text').notNull(),
  last_modified_date: text('last_modified_date').default(sql`CURRENT_TIMESTAMP`),
  last_modified_by: text('last_modified_by'),
  push_status_id : integer('push_status_id').default(0),
  push_date: text('push_date').default(sql`CURRENT_TIMESTAMP`),
  deleted_date: text('deleted_date').default(sql`CURRENT_TIMESTAMP`),
  deleted_by: text('deleted_by'),
  is_deleted: integer('is_deleted', {mode:'boolean'}).default(false),
  remarks: text('remarks'), 
})

export const useraccess = sqliteTable('useraccess',{
  id: text('id').notNull().primaryKey(),
  user_id: text('user_id').notNull().references(() => users.id),
  module_id: text('module_id').notNull().references(() => modules.id),
  permission_id: text('permission_id').notNull().references(() => permissions.id),
  created_date: text('created_date').default(sql`CURRENT_TIMESTAMP`).notNull(),
  created_by: text('created_by').notNull(),
  last_modified_date: text('last_modified_date').default(sql`CURRENT_TIMESTAMP`),
  last_modified_by: text('last_modified_by'),
  push_status_id : integer('push_status_id').default(0),
  push_date: text('push_date').default(sql`CURRENT_TIMESTAMP`),
  deleted_date: text('deleted_date').default(sql`CURRENT_TIMESTAMP`),
  deleted_by: text('deleted_by'),
  is_deleted: integer('is_deleted', {mode:'boolean'}).default(false),
  remarks: text('remarks'), 
})