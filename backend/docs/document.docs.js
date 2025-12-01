/**
 * @swagger
 * tags:
 *   name: Documents
 *   description: Endpoints for document management.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Document:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Document ID
 *         title:
 *           type: string
 *           description: Document title
 *         content:
 *           type: string
 *           description: Contents of the document
 *         date:
 *           type: string
 *           format: date-time
 *           description: Document creation date
 *         log:
 *           type: object
 *           description: Log associated with the document
 *           properties:
 *             id:
 *               type: string
 *               description: Log ID
 *             message:
 *               type: string
 *               description: Log message
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Record creation date
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date of last update of the record
 *     DocumentInput:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - log
 *       properties:
 *         title:
 *           type: string
 *           description: Document title
 *           example: "Título del Documento"
 *         content:
 *           type: string
 *           description: Contents of the document
 *           example: "Contenido del documento..."
 *         log:
 *           type: string
 *           description: Associated log ID
 *           example: "60d5ec9f8c3da2b348d27e4a"
 */

/**
 * @swagger
 * /documents:
 *   post:
 *     summary: Create a new document
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DocumentInput'
 *     responses:
 *       201:
 *         description: Documento created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Document'
 *       400:
 *         description: Error in data validation
 *   get:
 *     summary: Get all documents
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 5
 *         description: Number of records per page
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           example: desc
 *         description: Sort order (ascending or descending)
 *     responses:
 *       200:
 *         description: List of documents
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Document'
 */

/**
 * @swagger
 * /documents/{id}:
 *   get:
 *     summary: Obtain a document by ID
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Document ID
 *     responses:
 *       200:
 *         description: Document found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Document'
 *       404:
 *         description: Document not found
 *   patch:
 *     summary: Update a document
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Document ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DocumentInput'
 *     responses:
 *       200:
 *         description: Document updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Document'
 *       404:
 *         description: Document not found
 *   delete:
 *     summary: Delete a document
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Document ID
 *     responses:
 *       200:
 *         description: Document deleted successfully
 *       404:
 *         description: Document not found
 */
