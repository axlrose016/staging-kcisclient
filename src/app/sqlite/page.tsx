"use client";

import { useDatabase } from '@/hooks/use-sqlitedb';
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button';

import initSqlJs from "sql.js";


function SqlitePlayground() {
    // const { loadDatabase } = useDatabase();
    const [fileHandle, setFileHandle] = useState<FileSystemFileHandle | null>(null);

    useEffect(() => {


        (async () => {
            const dirHandle = await window.showDirectoryPicker();
            const promises = [];
            for await (const entry of dirHandle.values()) {
                if (entry.kind !== 'file') {
                    continue;
                }
                const fileHandle = entry as FileSystemFileHandle;
                promises.push(fileHandle.getFile().then((file: File) => `${file.name} (${file.size})`));
            }
            console.log(await Promise.all(promises));

        })();

        // console.log(loadDatabase(null))
    }, [])

    async function pickAndVerifyFile() {
        try {
            // Open file picker and get the file handle
            const [handle] = await window.showOpenFilePicker({
                types: [
                    {
                        description: 'SQLite Database',
                        accept: {
                            'application/x-sqlite3': ['.db', '.sqlite', '.sqlite3']
                        }
                    }
                ]
            });

            // Verify we have permission to access the file
            const hasPermission = await verifyPermission(handle, true);

            if (hasPermission) {
                setFileHandle(handle);
                const file = await handle.getFile();
                console.log('File selected:', file);
                // You can now use the file with loadDatabase
                // await loadDatabase(file);
            } else {
                console.error('Permission denied');
            }
        } catch (error) {
            console.error('Error picking file:', error);
        }
    }

    async function verifyPermission(fileHandle: FileSystemFileHandle, readWrite: boolean): Promise<boolean> {
        const options: FileSystemPermissionMode = {};
        if (readWrite) {
            options.mode = 'readwrite';
        }
        // Check if permission was already granted. If so, return true.
        if ((await fileHandle.queryPermission(options)) === 'granted') {
            return true;
        }
        // Request permission. If the user grants permission, return true.
        if ((await fileHandle.requestPermission(options)) === 'granted') {
            return true;
        }
        // The user didn't grant permission, so return false.
        return false;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">SQLite Playground</h1>
            <div className="space-y-4">
                <Button
                    onClick={pickAndVerifyFile}
                    variant="outline"
                >
                    Pick SQLite Database 1
                </Button>
                {fileHandle && (
                    <p className="text-sm text-muted-foreground">
                        File selected and permission granted
                    </p>
                )}
            </div>
        </div>
    )
}

export default SqlitePlayground
