import { useEffect } from 'react';

//redux
import { useDispatch } from 'react-redux';

import { updatePositions } from 'redux/Tags/tags.actions';

import { updateAlertsSocket, fetchAlerts } from 'redux/Alerts/Alerts.actions';

//socket
import socketIOClient from 'socket.io-client';
import { mutate } from 'swr';

const useWebSocket = (endpoint) => {
  const dispatch = useDispatch();
  useEffect(() => {
    console.log('Connecting socketio');
    let socket = socketIOClient(endpoint);
    // const socket = socketIOClient(endpoint, {
    //   transports: ['websocket'],
    // });
    // console.log(socket);
    socket.on('data_message', (payload) => {
      dispatch(updatePositions(payload.data));
    });
    socket.on('data_alert', (payload) => {
      dispatch(updateAlertsSocket(payload.data));
      mutate('alert_history', undefined, true);
    });
    socket.on('closed_alert', (payload) => {
      dispatch(fetchAlerts());
    });
    return () => {
      socket.close();
    };
  }, [endpoint, dispatch]);
};

export default useWebSocket;
