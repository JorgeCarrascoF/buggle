/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Endpoints for comment management.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique comment ID
 *         text:
 *           type: string
 *           description: Comment text
 *         pinned:
 *           type: boolean
 *           description: Indicates whether the comment is pinned
 *           example: false
 *         date:
 *           type: string
 *           format: date-time
 *           description: Comment creation date
 *         user:
 *           type: object
 *           description: User associated with the comment
 *           properties:
 *             id:
 *               type: string
 *               description: User ID
 *             fullName:
 *               type: string
 *               description: User's full name
 *         log:
 *           type: object
 *           description: Log associated with the comment
 *           properties:
 *             id:
 *               type: string
 *               description: Log ID
 *             message:
 *               type: string
 *               description: Log message
 *     CommentInput:
 *       type: object
 *       required:
 *         - text
 *         - logId
 *       properties:
 *         text:
 *           type: string
 *           description: Comment text
 *           example: "Texto del Comentario"
 *         pinned:
 *           type: boolean
 *           description: Indicates whether the comment is pinned
 *           example: false
 *         logId:
 *           type: string
 *           description: Associated log ID
 *           example: "60d5ec9f8c3da2b348d27e4a"
 */

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommentInput'
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Error in input data
*/


/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Get all comments (with filters and pagination)
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *     responses:
 *       200:
 *         description: Comments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 total:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Comment'
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Access denied
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /comments/log/{logId}:
 *   get:
 *     summary: Obtener comentarios de un registro específico (con filtros y paginación)
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: logId
 *         required: true
 *         schema:
 *           type: string
 *         description: Associated log ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Number of comments per page
 *     responses:
 *       200:
 *         description: List of comments from the requested log
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 count:
 *                   type: integer
 *                   description: Number of comments returned on this page
 *                 total:
 *                   type: integer
 *                   description: Total comments for this log
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Comment'
 *       401:
 *         description: Invalid or not provided token
 *       404:
 *         description: No comments found for this log
 *       500:
 *         description: Server error
 */


/**
 * @swagger
 * /comments/{id}:
 *   get:
 *     summary: Get a comment by ID
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Comment not found
 *   patch:
 *     summary: Update a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommentInput'
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Comment not found
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment successfully deleted
 *       404:
 *         description: Comment not found
 */
