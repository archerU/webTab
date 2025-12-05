// Chrome Extension API type declarations
declare namespace chrome {
  namespace storage {
    interface StorageArea {
      get(keys: string | string[] | null, callback: (items: { [key: string]: any }) => void): void;
      set(items: { [key: string]: any }, callback?: () => void): void;
      remove(keys: string | string[], callback?: () => void): void;
      clear(callback?: () => void): void;
    }
    
    const sync: StorageArea;
    const local: StorageArea;
  }
  
  namespace runtime {
    interface LastError {
      message?: string;
    }
    const lastError: LastError | undefined;
  }
}

declare const chrome: typeof chrome | undefined;

