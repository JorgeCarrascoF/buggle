/**
 * @swagger
 * /:projectId/envelope:
 *   post:
 *     summary: Receive error events from Sentry (webhook).
 *     description: Endpoint that automatically processes events sent by Sentry and saves or updates them as Logs.
 *     tags:
 *       - Envelope
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: object
 *                 properties:
 *                   event:
 *                     type: object
 *                     properties:
 *                       event_id:
 *                         type: string
 *                         example: "a1b2c3d4e5f6..."
 *                       issue_id:
 *                         type: string
 *                         example: "a1b2c3d4e5f6..."
 *                       short_id:
 *                         type: string
 *                         example: "PROJ-1"
 *                       title:
 *                         type: string
 *                         example: "TypeError: Cannot read property 'x' of undefined"
 *                       level:
 *                         type: string
 *                         example: "error"
 *                       web_url:
 *                         type: string
 *                         example: "https://sentry.io/abcde/demo/issues/1/"
 *                       culprit:
 *                         type: string
 *                         example: "app/controllers/userController.js"
 *                       location:
 *                         type: string
 *                         example: "line 42"
 *                       metadata:
 *                         type: object
 *                         properties:
 *                           function:
 *                             type: string
 *                             example: "getUser"
 *                       type:
 *                         type: string
 *                         enum: [error, warning, info]
 *                         example: "error"
 *                       environment:
 *                         type: string
 *                         enum: [testing, development, production]
 *                         example: "production"
 *                       user:
 *                         type: object
 *                         properties:
 *                           ip_address:
 *                             type: string
 *                             example: "192.168.1.1"
 *                       timestamp:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-08-20T19:28:52.670Z"
 *     responses:
 *       201:
 *         description: Log created from Sentry webhook
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Log created from Sentry webhook"
 *                 log:
 *                   $ref: '#/components/schemas/Log'
 *       200:
 *         description: Log updated from Sentry webhook
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Log updated from Sentry webhook"
 *                 log:
 *                   $ref: '#/components/schemas/Log'
 *       400:
 *         description: Missing data in payload
 *       500:
 *         description: Error processing webhook on the server
 */
