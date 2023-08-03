import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";

type CallbackFunction = (...args: any[]) => void;

interface SocketIOClientOptions {
  url?: string;
  onConnectionChange: (isConnected: boolean) => void;
  reconnectAttemptsDelay?: number;
  maxReconnectAttempts?: number;
  onMaxReconnectAttemptsReached?: () => void;
}

function generateRandomId() {
  let id = "";
  const characters =
    "ABCDEFGHI-JKLMNOPQRSTUV-WXYZabc-efghij-klmnopq-rstuvwxy-z0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < 20; i++) {
    id += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return id;
}

export default class SocketIOClient {
  private static instance: SocketIOClient;
  socket: Socket | null = null;
  private readonly url?: string;
  public isConnected = false;
  private readonly onConnectionChangeCallback?: (isConnected: boolean) => void;
  private readonly reconnectAttemptsDelay: number = 1000;
  private readonly maxAttempts: number = 10;
  private attempts = 0;
  private readonly onMaxAttemptsReachedCallback?: () => void;
  private idDevice = generateRandomId();

  private constructor(
    options: SocketIOClientOptions,
    //url: string, onConnectionChange?: (isConnected: boolean) => void, maxAttempts = 10, onMaxAttemptsReached?: () => void
  ) {
    this.url = options.url;
    this.onConnectionChangeCallback = options.onConnectionChange;
    this.reconnectAttemptsDelay =
      options.reconnectAttemptsDelay || this.reconnectAttemptsDelay;
    this.maxAttempts = options.maxReconnectAttempts || this.maxAttempts;
    this.onMaxAttemptsReachedCallback = options.onMaxReconnectAttemptsReached;
  }

  public static getInstance(options: SocketIOClientOptions): SocketIOClient {
    if (!SocketIOClient.instance) {
      SocketIOClient.instance = new SocketIOClient(options);
    }
    return SocketIOClient.instance;
  }

  private attemptReconnect(): void {
    if (!this.isConnected && this.attempts <= this.maxAttempts) {
      setTimeout(() => {
        this.reconnect();
        this.attemptReconnect();
      }, this.reconnectAttemptsDelay);
      this.attempts++;
      console.log(this.attempts);
    } else if (this.onMaxAttemptsReachedCallback) {
      this.onMaxAttemptsReachedCallback();
    }
  }

  public connect(): void {
    this.socket = this.url
      ? io(this.url, {
          query: {
            idDevice: this.idDevice,
          },
        })
      : io({
          query: {
            idDevice: this.idDevice,
          },
        });
    this.socket.on("connect", () => {
      this.isConnected = true;
      this.onConnectionChange(this.isConnected);
      this.attempts = 0;
    });
    this.socket.on("disconnect", () => {
      this.isConnected = false;
      this.onConnectionChange(this.isConnected);
      this.attemptReconnect();
    });
    this.socket.on("reconnect", () => {
      this.isConnected = true;
      this.onConnectionChange(this.isConnected);
      this.attempts = 0;
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
    console.log(
      `Connection status changed to ${
        isConnected ? "connected" : "disconnected"
      }`,
    );
    if (this.onConnectionChangeCallback) {
      this.onConnectionChangeCallback(isConnected);
    }
  }

  public listen(eventName: string, callback: CallbackFunction): void {
    if (this.socket) {
      this.socket.on(eventName, callback);
    }
  }
}
