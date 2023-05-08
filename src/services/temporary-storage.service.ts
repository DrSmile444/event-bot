export enum TemporaryStorageKey {
  WEBHOOK_OPTIMIZATION = 'WEBHOOK_OPTIMIZATION',
}

export interface TemporaryStorageStore {
  [TemporaryStorageKey.WEBHOOK_OPTIMIZATION]: string[];
}

export class TemporaryStorageService {
  private readonly store: TemporaryStorageStore = {
    [TemporaryStorageKey.WEBHOOK_OPTIMIZATION]: [],
  };

  addStoreItem<T extends TemporaryStorageKey, V extends TemporaryStorageStore[T]>(key: T, value: V extends any[] ? V[number] : V) {
    this.store[key].push(value);
    this.removeItemAfterTime(key, value);
  }

  hasStoreItem<T extends TemporaryStorageKey, V extends TemporaryStorageStore[T]>(key: T, value: V extends any[] ? V[number] : V) {
    return this.store[key].includes(value);
  }

  private removeItemAfterTime<T extends TemporaryStorageKey, V extends TemporaryStorageStore[T]>(
    key: T,
    value: V extends any[] ? V[number] : V,
  ) {
    setTimeout(() => {
      this.store[key] = this.store[key].filter((item) => item !== value);
    }, 1000 * 60);
  }
}

export const temporaryStorageService = new TemporaryStorageService();
