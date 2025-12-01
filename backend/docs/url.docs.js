
/**
 * @swagger
 * tags:
 *   name: URL
 *   description: URL validation endpoints.
 */

/**
 * @swagger
 * /url/check-url:
 *   post:
 *     summary: Check if a URL is valid
 *     tags: [URL]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *                 format: uri
 *                 description: URL to validate
 *                 example: "https://example.com"
 *     responses:
 *       200:
 *         description: URL validation result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 isValid:
 *                   type: boolean
 *                   description: Whether the URL is valid and accessible
 *       400:
 *         description: Invalid request
 */