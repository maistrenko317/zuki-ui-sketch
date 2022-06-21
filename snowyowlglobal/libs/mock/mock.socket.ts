import {Socket} from "@snowl/base-app/shared";

class MockSocket implements Socket {
  handlers: {[event: string]: Function[]} = {};

  close(): void {
  }

  emit(event: string, data: any): void {
  }

  on<T>(event: string, callback: (data: T) => any): void {
    if (!this.handlers[event])
      this.handlers[event] = [];

    this.handlers[event].push(callback);
  }

  sendToClient(event: string, data: any): void {
    const handlers = this.handlers[event];
    if (!handlers) {
      return;
    }
    if (typeof data !== 'string') {
      data = JSON.stringify(data);
    }

    handlers.forEach(handler => handler(data));
  }

}

export const MOCK_SOCKET = new MockSocket();
