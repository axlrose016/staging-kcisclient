"use client";

import { useEffect, useState } from "react";
import PouchDB from "pouchdb";

const localDB = new PouchDB("users_db");
const remoteDB = new PouchDB("http://your-couchdb-server.com/users_db"); // Replace with actual CouchDB URL

export default function PouchDBPage() {
  const [users, setUsers] = useState<{ _id: string; name: string }[]>([]);
  const [name, setName] = useState("");

  // Fetch all users from local PouchDB
  async function fetchUsers() {
    const result = await localDB.allDocs<{ _id: string; name: string; _rev: string }>({
      include_docs: true,
    });
  
    // Filter out undefined docs and add the correct type
    const users = result.rows
      .map((row) => row.doc)
      .filter((doc): doc is { _id: string; name: string; _rev: string } => !!doc); // Type guard for valid docs
  
    setUsers(users);
  }
  
  // Add a new user
  async function addUser() {
    if (!name.trim()) return;
    const newUser = { _id: new Date().toISOString(), name };
    await localDB.put(newUser);
    setName("");
    fetchUsers();
  }

  // Sync with remote CouchDB
  async function syncDB() {
    localDB.sync(remoteDB, { live: true, retry: true }).on("change", fetchUsers);
  }

  useEffect(() => {
    fetchUsers();
    syncDB();
  }, []);

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">PouchDB Example</h1>

      <input
        type="text"
        placeholder="Enter name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 w-full rounded mb-2"
      />
      <button onClick={addUser} className="bg-blue-500 text-white px-4 py-2 rounded">
        Add User
      </button>

      <h2 className="text-xl font-semibold mt-4">Users:</h2>
      <ul className="mt-2 border p-3 rounded">
        {users.map((user) => (
          <li key={user._id} className="p-1 border-b">
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
