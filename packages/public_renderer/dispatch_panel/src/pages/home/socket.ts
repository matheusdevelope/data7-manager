import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";

export class SocketIOClient {
  private socket: Socket | null = null;
  private readonly url: string;
  public isConnected = false;
  private readonly onConnectionChangeCallback?: (isConnected: boolean) => void;

  constructor(url: string, onConnectionChange?: (isConnected: boolean) => void) {
    this.url = url;
    this.onConnectionChangeCallback = onConnectionChange;
  }

  public connect(): void {
    this.socket = io(this.url);
    this.socket.on("connect", () => {
      this.isConnected = true;
      this.onConnectionChange(this.isConnected);
    });
    this.socket.on("disconnect", () => {
      this.isConnected = false;
      this.onConnectionChange(this.isConnected);
    });
    this.socket.on("reconnect", () => {
      this.isConnected = true;
      this.onConnectionChange(this.isConnected);
    });
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.onConnectionChange(this.isConnected);
    }
  }

  public reconnect(): void {
    if (this.socket) {
      this.socket.connect();
    } else {
      this.connect();
    }
  }

  private onConnectionChange(isConnected: boolean): void {
    this.isConnected = isConnected;
    console.log(`Connection status changed to ${isConnected ? "connected" : "disconnected"}`);
    if (this.onConnectionChangeCallback) {
      this.onConnectionChangeCallback(isConnected);
    }
  }

  public listen(eventName: string, callback: (data: unknown) => void): void {
    if (this.socket) {
      this.socket.on(eventName, callback);
    }
  }
}
