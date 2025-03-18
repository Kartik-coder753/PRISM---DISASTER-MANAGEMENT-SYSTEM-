import { create } from 'zustand';
import type { Disaster, Alert } from '@shared/schema';

interface WebSocketStore {
  connected: boolean;
  disasters: Disaster[];
  alerts: Alert[];
  connect: () => void;
  addDisaster: (disaster: Disaster) => void;
  addAlert: (alert: Alert) => void;
}

export const useWebSocketStore = create<WebSocketStore>((set) => ({
  connected: false,
  disasters: [],
  alerts: [],
  connect: () => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      set({ connected: true });
      socket.send(JSON.stringify({ type: 'subscribe' }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'new_disaster') {
        set((state) => ({ disasters: [...state.disasters, data.data] }));
      } else if (data.type === 'new_alert') {
        set((state) => ({ alerts: [...state.alerts, data.data] }));
      }
    };

    socket.onclose = () => {
      set({ connected: false });
      // Attempt to reconnect after 5 seconds
      setTimeout(() => {
        set((state) => {
          state.connect();
          return state;
        });
      }, 5000);
    };
  },
  addDisaster: (disaster) => set((state) => ({ disasters: [...state.disasters, disaster] })),
  addAlert: (alert) => set((state) => ({ alerts: [...state.alerts, alert] })),
}));
