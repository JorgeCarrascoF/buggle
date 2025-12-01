/**
 * @swagger
 * tags:
 *   name: StatusRegister
 *   description: Endpoints for managing log status change history.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     StatusRegister:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique ID of the state record
 *         status:
 *           type: string
 *           enum: [unresolved, in review, solved]
 *           description: Status assigned to the log
 *           example: "in review"
 *         userId:
 *           type: string
 *           description: ID of the user who made the change
 *         logId:
 *           type: string
 *           description: ID of the affected log
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Date the change was made
 *
 *     StatusRegisterInput:
 *       type: object
 *       required:
 *         - logId
 *         - status
 *       properties:
 *         logId:
 *           type: string
 *           description: ID of the log whose status is updated
 *           example: "64a9f2c2e1a9b3f5a7d12345"
 *         status:
 *           type: string
 *           enum: [unresolved, in review, solved]
 *           description: New status to assign to the log
 *           example: "in review"
 */

/**
 * @swagger
 * /status-register:
 *   post:
 *     summary: Change the status of a log and record the change
 *     tags: [StatusRegister]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StatusRegisterInput'
 *     responses:
 *       200:
 *         description: Log status updated and change registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Log status updated and change registered successfully."
 *                 log:
 *                   $ref: '#/components/schemas/Log'
 *                 statusRegister:
 *                   $ref: '#/components/schemas/StatusRegister'
 *       400:
 *         description: Invalid data in the request
 *       401:
 *         description: Invalid token
 *       403:
 *         description: Access denied
 *       404:
 *         description: Log not found
 *       500:
 *         description: Server error
 *
 *   get:
 *     summary: Get all status change records
 *     tags: [StatusRegister]
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
 *         description: List of status change record obtained successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 5
 *                 count:
 *                   type: integer
 *                   example: 2
 *                 total:
 *                   type: integer
 *                   example: 20
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/StatusRegister'
 *       401:
 *         description: Invalid token
 *       403:
 *         description: Access denied
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /status-register/log/{logId}:
 *   get:
 *     summary: Get a status change record for a specific log
 *     tags: [StatusRegister]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: logId
 *         required: true
 *         schema:
 *           type: string
 *         description: Associated log ID
 *     responses:
 *       200:
 *         description: List of status change record requested
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
 *                   description: Status change record number returned on this page
 *                 total:
 *                   type: integer
 *                   description: Total status change record for this log
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Comment'
 *       401:
 *         description: Invalid token
 *       403:
 *         description: Access denied
 *       404:
 *         description: No status change record was found for this log
 *       500:
 *         description: Server error
 */



/**
 * @swagger
 * /status-register/{id}:
 *   get:
 *     summary: Get status change record by ID
 *     tags: [StatusRegister]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the status record to obtain
 *     responses:
 *       200:
 *         description: Status change record obtained successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StatusRegister'
 *       401:
 *         description: Invalid token
 *       403:
 *         description: Access denied
 *       404:
 *         description: status change record not found
 *       500:
 *         description: Server error
 */
