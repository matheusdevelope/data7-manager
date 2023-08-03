import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";

type CallbackFunction = (...args: any[]) => void;

interface SocketIOClientOptions {
  url?: string;
  onConnectionChange: (isConnected: boolean) => void;
  maxReconnectAttempts?: number;
  onMaxReconnectAttemptsReached?: () => void;
}

export class SocketIOClient {
  private static instance: SocketIOClient | null = null;
  private socket: Socket | null = null;
  private url?: string;
  private onConnectionChange: (isConnected: boolean) => void;
  private maxReconnectAttempts: number | undefined;
  private reconnectAttempts = 0;
  private onMaxReconnectAttemptsReached: (() => void) | undefined;

  private constructor(options: SocketIOClientOptions) {
    this.url = options.url;
    this.onConnectionChange = options.onConnectionChange;
    this.maxReconnectAttempts = options.maxReconnectAttempts;
    this.onMaxReconnectAttemptsReached = options.onMaxReconnectAttemptsReached;

    this.connect();
  }

  public static getInstance(options: SocketIOClientOptions): SocketIOClient {
    if (!SocketIOClient.instance) {
      SocketIOClient.instance = new SocketIOClient(options);
    }
    return SocketIOClient.instance;
  }

  public connect(): void {
    if (!this.socket || !this.socket.connected) {
      this.socket = this.url?io(this.url):io();
      this.setupListeners();
    }
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  public reconnect(): void {
    if (this.socket) {
      this.socket.connect();
    }
  }

  public onConnectionChangeCallback(isConnected: boolean): void {
    this.onConnectionChange(isConnected);

    if (!isConnected && this.maxReconnectAttempts && this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      this.reconnect();
    } else if (!isConnected && this.maxReconnectAttempts && this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.onMaxReconnectAttemptsReached && this.onMaxReconnectAttemptsReached();
    } else {
      this.reconnectAttempts = 0;
    }
  }

  public listen(eventName: string, callback: CallbackFunction): void {
    if (this.socket) {
      this.socket.on(eventName, callback);
    }
  }

  private setupListeners(): void {
    if (this.socket) {
      this.socket.on("connect", () => this.onConnectionChangeCallback(true));
      this.socket.on("disconnect", () => this.onConnectionChangeCallback(false));
      this.socket.on("connect_error", () => this.onConnectionChangeCallback(false));
      this.socket.on("connect_timeout", () => this.onConnectionChangeCallback(false));
      this.socket.on("error", () => this.onConnectionChangeCallback(false));
    }
  }
}
