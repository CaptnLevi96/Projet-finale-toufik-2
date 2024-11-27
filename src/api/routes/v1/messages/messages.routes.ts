import { Status } from './../../../utils/statusCode.ts';
import { createRoute, z } from '@hono/zod-openapi'
import { defaultErrorJsonContent, jsonContent } from '../../../utils/apiResponses.ts'
import { userSchema } from '../users/users.routes.ts'  // Correction du chemin d'importation

// Export de l'ID utilisateur pour référence
export const userIdSchema = userSchema.shape.id

// Schéma des messages
export const messageSchema = z.object({
    id: z.coerce.number().openapi({
        example: 456,
        param: {
            name: 'id',
            in: 'path',
        }
    }),
    userId: userIdSchema.openapi({
        example: 123,
        description: "ID de l'utilisateur qui a créé le message"
    }),
    content: z.string().min(1).openapi({
        example: 'Contenu du message',
        description: 'Le contenu du message'
    }),
    createdAt: z.string().datetime().openapi({
        example: '2024-03-26T10:30:00Z',
        description: 'Date de création du message'
    }),
})

const tags = ["Messages"]

// Lecture d'un message
export const read = createRoute({
    path: '/messages/{id}',
    method: 'get',
    tags,
    request: {
        params: z.object({
            id: messageSchema.shape.id
        })
    },
    responses: {
        [Status.OK]: jsonContent(
            messageSchema,
            'Message'
        ),
        [Status.NOT_FOUND]: defaultErrorJsonContent("Message non trouvé"),
        [Status.UNPROCESSABLE_ENTITY]: defaultErrorJsonContent("Entrée invalide"),
    }
})

export const readList = createRoute({
    path: '/messages',
    method: 'get',
    tags,
    // Correction du paramètre de requête optionnel
    request: {
        query: z.object({
            userId: z.string().optional()
        })
    },
    responses: {
        [Status.OK]: jsonContent(
            z.array(messageSchema),
            'Liste des messages'
        ),
    }
})

export const create = createRoute({
    path: '/messages',
    method: 'post',
    tags,
    request: {
        body: jsonContent(
            messageSchema.omit({ id: true, createdAt: true }),
            'Message à créer',
            true
        )
    },
    responses: {
        [Status.CREATED]: jsonContent(
            messageSchema,
            'Message créé'
        ),
        [Status.UNPROCESSABLE_ENTITY]: defaultErrorJsonContent("Entrée invalide"),
        [Status.UNAUTHORIZED]: defaultErrorJsonContent("Non autorisé"),
    }
})

export const remove = createRoute({
    path: '/messages/{id}',
    method: 'delete',
    tags,
    request: {
        params: z.object({
            id: messageSchema.shape.id
        }),
        query: z.object({
            userId: userIdSchema
        })
    },
    responses: {
        [Status.NO_CONTENT]: {
            description: 'Message supprimé avec succès'
        },
        [Status.NOT_FOUND]: defaultErrorJsonContent("Message non trouvé"),
        [Status.UNAUTHORIZED]: defaultErrorJsonContent("Non autorisé - Seul le propriétaire peut supprimer son message"),
    }
})

export type ReadMessageRoute = typeof read
export type ReadListMessagesRoute = typeof readList
export type CreateMessageRoute = typeof create
export type DeleteMessageRoute = typeof remove