import { useState, useEffect } from "react";
import PouchDB from "pouchdb";
import { IUser } from "@/components/interfaces/iuser";

// Initialize PouchDB
const localDB = new PouchDB("users");

export default function UsersOfflineService() {
    const [_users, setUsers] = useState<any[]>([]); 
    const [_user, setUser] = useState<string>(""); 

    // Fetch users from local PouchDB
    async function fetchUsers() {
        try {
            const result = await localDB.allDocs({ include_docs: true });
            const usersData = result.rows.map(row => row.doc);
            setUsers(usersData);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    }

    // Insert user into PouchDB
    async function addUser(userData: IUser) {
        try {
            // Check if user already exists
            const existingUser = await localDB.get(userData.id).catch(() => null);
            if (existingUser) {
                console.warn("User already exists with ID:", userData.id);
                return;
            }

            await localDB.put(userData);
            fetchUsers(); // Refresh user list after adding
        } catch (error) {
            console.error("Error adding user:", error);
        }
    }

    // Run fetchUsers on mount
    useEffect(() => {
        fetchUsers();
    }, []);

    return {
        users: _users,
        fetchUsers,
        addUser, 
    };
}
