import { EventSourcePolyfill } from 'event-source-polyfill';

import { MessageNotification } from '../components/message-notification/message-notification.component';
import { store } from '../store';
import { ChatNotification, SseEvents } from '../types/notifications';
import { infoToast } from './toasts';

let subscription: EventSourcePolyfill;

export function connectSSE(token?: string) {
    if (subscription) {
        return subscription;
    }

    subscription = new EventSourcePolyfill(import.meta.env.VITE_SSE_BACKEND, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    subscription.onmessage = (event) => {
        const eventData = JSON.parse(event.data) as SseEvents;
        console.log(eventData);
        switch (eventData.eventName) {
            case 'chat-group-message': {
                let { user } = store.getState().auth;
                if (eventData?.message?.User?.ID === user.ID) {
                    console.log('Message sent by me');
                    return;
                }

                if (
                    !user?.GroupsJoined?.reduce((acc, cur) => {
                        acc.push(cur.ID);
                        return acc;
                    }, [] as string[]).includes(eventData?.message?.Group?.ID)
                ) {
                    console.log(
                        'I am not part of the group that received the message',
                    );
                    return;
                }
                return MessageNotification(eventData as ChatNotification);
            }
            default:
                return infoToast(
                    `${eventData.eventName} is not a supported notification type`,
                );
        }
    };
}

export function disconnectSSE() {
    if (subscription) {
        subscription.close();
        subscription = null!;
    }
}
