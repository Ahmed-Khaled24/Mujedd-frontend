import { appApi } from '.';
import {
    MessagesNotification,
    ReadNotificationDto,
    SseEvents,
} from '../../types/notifications';
import { GenericResponse } from '../../types/response';
import { PaginationDto } from '../../types/search';

export const notificationApi = appApi.injectEndpoints({
    endpoints: (builder) => ({
        fetchMessages: builder.query<MessagesNotification[], void>({
            query: () => ({
                url: '/notifications/messages',
                method: 'GET',
            }),
        }),
        fetchUserNotifications: builder.query<
            GenericResponse<SseEvents[]>,
            PaginationDto
        >({
            providesTags: ['User Notifications'],
            query: ({ limit = 10, offset = 0 }) => ({
                url: `/notifications?limit=${limit}&offset=${offset}`,
                method: 'GET',
            }),
            keepUnusedDataFor: 0,
        }),
        readNotification: builder.mutation<void, ReadNotificationDto>({
            invalidatesTags: ['User Notifications'],
            query: (data) => ({
                url: `/notifications/read`,
                method: 'PATCH',
                body: data,
            }),
        }),
    }),
});

export const {
    useFetchUserNotificationsQuery,
    useFetchMessagesQuery,
    useReadNotificationMutation,
} = notificationApi;
