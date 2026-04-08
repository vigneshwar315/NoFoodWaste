import { useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

let socketInstance = null;

const getSocket = () => {
  if (!socketInstance) {
    socketInstance = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket'],
      reconnectionAttempts: 5,
    });
  }
  return socketInstance;
};

/**
 * useSocket hook
 * @param {Object} options
 * @param {string[]} options.rooms - rooms to join on connect
 * @param {Object} options.listeners - { eventName: handlerFn }
 */
export const useSocket = ({ rooms = [], listeners = {} } = {}) => {
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    // Join rooms
    rooms.forEach((room) => {
      if (room) socket.emit('join_room', room);
    });

    // Register event listeners
    const entries = Object.entries(listeners);
    entries.forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    return () => {
      // Cleanup listeners on unmount
      entries.forEach(([event, handler]) => {
        socket.off(event, handler);
      });
    };
  }, []); // eslint-disable-line

  const emit = useCallback((event, data) => {
    socketRef.current?.emit(event, data);
  }, []);

  return { socket: socketRef.current, emit };
};

export default useSocket;
