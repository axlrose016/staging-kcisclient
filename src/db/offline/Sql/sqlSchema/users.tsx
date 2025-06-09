export const createUsersTable = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT NOT NULL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role_id TEXT NOT NULL,
  created_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by TEXT NOT NULL,
  last_modified_date TEXT DEFAULT CURRENT_TIMESTAMP,
  last_modified_by TEXT,
  push_status_id INTEGER DEFAULT 0,
  push_date TEXT DEFAULT CURRENT_TIMESTAMP,
  deleted_date TEXT DEFAULT CURRENT_TIMESTAMP,
  deleted_by TEXT,
  is_deleted INTEGER DEFAULT 0,
  remarks TEXT,
  FOREIGN KEY (role_id) REFERENCES roles(id)
);
`;

export const createUserAccessTable = `
CREATE TABLE IF NOT EXISTS useraccess (
  id TEXT NOT NULL PRIMARY KEY,
  user_id TEXT NOT NULL,
  module_id TEXT NOT NULL,
  permission_id TEXT NOT NULL,
  created_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by TEXT NOT NULL,
  last_modified_date TEXT DEFAULT CURRENT_TIMESTAMP,
  last_modified_by TEXT,
  push_status_id INTEGER DEFAULT 0,
  push_date TEXT DEFAULT CURRENT_TIMESTAMP,
  deleted_date TEXT DEFAULT CURRENT_TIMESTAMP,
  deleted_by TEXT,
  is_deleted INTEGER DEFAULT 0,
  remarks TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (module_id) REFERENCES modules(id),
  FOREIGN KEY (permission_id) REFERENCES permissions(id)
);
`;