import useAxios from 'axios-hooks';
import { WritableAtom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { triggerFetchAtom } from '../store/triggerFetchState';
import { ApiPath, SocketEvent } from 'types';
import { socket } from '../sockets';
import { Character, Tile } from 'database';
import merge from 'lodash/merge';
import { ActionWithRelations } from '../types/ActionWithRelations';

// TODO: add types for atoms

interface useSyncProps<T> {
  atom: WritableAtom<any, any, any>;
  url: ApiPath;
  params: Object;
  socketEvent: SocketEvent;
  socketFullUpdateEvent: SocketEvent;
}

interface SocketEntity<T> {
  data: T;
  isFullUpdate: boolean;
}

export const useSync = <T extends ActionWithRelations | Character | Tile>({
  atom,
  url,
  params = {},
  socketEvent,
  socketFullUpdateEvent,
}: useSyncProps<T>) => {
  const triggerFetch = useAtomValue(triggerFetchAtom);
  const [latestFetchTrigger, setLatestFetchTrigger] = useState(triggerFetch);
  const [isFirstFetch, setFirstFetch] = useState(true);
  const setData = useSetAtom(atom);
  const [{ data: dataResponse, loading, error }, execute, refetch] = useAxios(
    { url, params },
    {
      manual: true,
    },
  );

  // initial data fetch
  useEffect(() => {
    console.log('initial fetch', { url });
    execute();
  }, []);

  // setup socket connection and listen for changes
  useEffect(() => {
    if (loading || isFirstFetch) {
      return;
    }

    console.log('setup socket connection', { socketEvent });

    socket.on(socketEvent, ({ data: newData, isFullUpdate = false }: SocketEntity<T>) => {
      if (!newData?.id) {
        return;
      }

      let isVersionCorrect = true;
      let itemExists = false;

      setData((previousData: any) => {
        console.log('socket event received', { newData, previousData, isFullUpdate });

        const updatedData = previousData.map((item: T) => {
          if (item.id === newData.id) {
            itemExists = true;
            isVersionCorrect =
              item.version + 1 === newData.version || item.version === newData.version;

            return merge(item, newData);
          }

          return item;
        });

        if (!itemExists) {
          updatedData.push(newData);
        }

        if (!isVersionCorrect && !isFullUpdate) {
          socket.emit(socketFullUpdateEvent, { ...params, id: newData.id });
        }

        return updatedData;
      });
    });

    return () => {
      console.log('remove socket connection', socketEvent);
      socket.off(socketEvent);
    };
  }, [loading, isFirstFetch]);

  // listen to global triggerFetch changes
  useEffect(() => {
    if (latestFetchTrigger === triggerFetch) {
      return;
    }

    console.log('triggerFetch changed - refetch query', { url, loading });
    setLatestFetchTrigger(triggerFetch);
    refetch();
  }, [triggerFetch, latestFetchTrigger]);

  // set data when response is received
  useEffect(() => {
    if (dataResponse) {
      console.log('set data', { dataResponse, url });
      setData(dataResponse);
      setFirstFetch(false);
    }
  }, [dataResponse]);

  return null;
};
