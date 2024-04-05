import _ from 'lodash';

import { appApi } from '.';
import { ArticleToSend } from '../../types/article.d';

const articleApi = appApi.injectEndpoints({
    endpoints: (builder) => ({
        createArticle: builder.mutation<Response, ArticleToSend>({
            invalidatesTags: ['Article'],
            query: (article) => ({
                url: '/articles',
                method: 'POST',
                body: article,
            }),
        }),
        getArticles: builder.query<Response, void>({
            providesTags: ['Article'],
            query: () => ({
                url: '/articles',
                method: 'GET',
            }),
        }),
        getArticle: builder.query<Response, number>({
            providesTags: (_result, _error, id) => [{ type: 'Article', id }],
            query: (id) => ({
                url: `/articles/${id}`,
                method: 'GET',
            }),
        }),
        //Ask Them to add Id
        getUserArticles: builder.query<Response, void>({
            query: () => ({
                url: '/articles/created',
                method: 'GET',
            }),
        }),
        updateArticle: builder.mutation<
            Response,
            Partial<ArticleToSend> & { id: number }
        >({
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'Article', id },
            ],
            query: (update) => ({
                url: `/articles/${update.id}`,
                method: 'PATCH',
                body: _.omit(update, 'id'),
            }),
        }),
        deleteArticle: builder.mutation<Response, number>({
            invalidatesTags: ['Article'],
            query: (id) => ({
                url: `/articles/${id}`,
                method: 'DELETE',
            }),
        }),
        toggleLoveArticle: builder.mutation<Response, number>({
            invalidatesTags: (_result, _error, id) => [{ type: 'Article', id }],
            query: (id) => ({
                url: `/articles/${id}/toggle-like`,
                method: 'POST',
            }),
        }),
    }),
});

export const {
    useCreateArticleMutation,
    useGetArticlesQuery,
    useGetArticleQuery,
    useLazyGetArticleQuery,
    useUpdateArticleMutation,
    useDeleteArticleMutation,
    useGetUserArticlesQuery,
    useToggleLoveArticleMutation,
} = articleApi;
