interface FileSystemPermissionMode {
  mode?: 'read' | 'readwrite';
}

interface FileSystemHandle {
  queryPermission(descriptor: FileSystemPermissionMode): Promise<PermissionState>;
  requestPermission(descriptor: FileSystemPermissionMode): Promise<PermissionState>;
}

interface FileSystemFileHandle extends FileSystemHandle {
  getFile(): Promise<File>;
}

interface Window {
  showOpenFilePicker(options?: {
    types?: Array<{
      description?: string;
      accept: Record<string, string[]>;
    }>;
  }): Promise<FileSystemFileHandle[]>;
} 