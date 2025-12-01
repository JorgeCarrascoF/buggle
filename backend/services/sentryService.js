// 1. Función principal de transformación

async function processSentryWebhook(webhookPayload) {
    try {
        const sentryEvent = webhookPayload.data.event;

        // Paso 1: Transformar y procesar proyecto
        const projectData = await transformProject(sentryEvent);

        // Paso 2: Transformar y procesar evento
        const eventData = await transformEvent(sentryEvent, projectData.id);

        // Paso 3: Evaluar si crear incidencia
        const incidentData = await evaluateAndCreateIncident(sentryEvent, eventData, webhookPayload.data.triggered_rule);

        return {
            project: projectData,
            event: eventData,
            incident: incidentData
        };

    } catch (error) {
        console.error('Error processing Sentry webhook:', error);
        throw error;
    }
}

// 2. Transformación de proyecto javascript
async function transformProject(sentryEvent) {
    // Del payload de Sentry, el proyecto viene como un ID numérico
    const sentryProjectId = sentryEvent.project.toString(); // "4509752919851088"

    // Buscar proyecto existente
    let project = await findProjectBySentryId(sentryProjectId);

    if (!project) {
        // Extraer información disponible del evento
        const projectData = {
            id: generateId(),
            sentry_project_id: sentryProjectId,
            name: extractProjectName(sentryEvent), // Ver función auxiliar abajo
            slug: extractProjectSlug(sentryEvent),
            platform: sentryEvent.platform, // "javascript"
            is_active: true
        };

        project = await createProject(projectData);
    }

    return project;
}

// Funciones auxiliares para extraer datos del proyecto
function extractProjectName(sentryEvent) {
    // El webhook no incluye nombre del proyecto directamente
    // Podrías extraerlo de la URL o usar un mapeo
    const urlPattern = /projects\/([^\/]+)\/([^\/]+)/;
    const match = sentryEvent.web_url?.match(urlPattern);
    return match ? match[2] : `Project-${sentryEvent.project}`;
}

function extractProjectSlug(sentryEvent) {
    // Similar al nombre, extraer del URL o generar
    return extractProjectName(sentryEvent).toLowerCase().replace(/\s+/g, '-');
}

// 3. Transformación de evento}
async function transformEvent(sentryEvent, projectId) {
    const eventData = {
        id: generateId(),
        issue_id: sentryEvent.issue_id, // "56076521"
        short_id: generateShortId(sentryEvent), // Se necesita generar esto
        title: sentryEvent.title, // "TypeError: num.toUpperCase is not a function"
        level: sentryEvent.level, // "error"
        project_id: projectId,
        status: mapSentryStatus(sentryEvent), // Ver función abajo
        count: parseInt(sentryEvent.stats?.['24h']?.reduce((sum, [_, count]) => sum + count, 0) || 1),
        user_count: 1, // Default, Sentry no lo proporciona claramente en este webhook
        is_unhandled: sentryEvent.exception?.values?.[0]?.mechanism?.handled === false,

        // Campos adicionales útiles
        permalink: sentryEvent.web_url,
        culprit: sentryEvent.culprit,
        first_seen: new Date(sentryEvent.datetime), // Usar timestamp del evento
        last_seen: new Date(sentryEvent.datetime),

        // Metadata como JSON
        metadata: {
            exception_type: sentryEvent.exception?.values?.[0]?.type,
            exception_value: sentryEvent.exception?.values?.[0]?.value,
            filename: sentryEvent.metadata?.filename,
            function: sentryEvent.metadata?.function,
            environment: getTagValue(sentryEvent.tags, 'environment'),
            browser: getTagValue(sentryEvent.tags, 'browser'),
            os: getTagValue(sentryEvent.tags, 'os'),
            url: getTagValue(sentryEvent.tags, 'url')
        }
    };

    // Verificar si el evento ya existe
    let existingEvent = await findEventByIssueId(sentryEvent.issue_id);

    if (existingEvent) {
        return await updateEvent(existingEvent.id, {
            count: eventData.count,
            last_seen: eventData.last_seen,
            updated_at: new Date()
        });
    } else {
        return await createEvent(eventData);
    }
}

// Funciones auxiliares
function mapSentryStatus(sentryEvent) {
    // Mapear estados de Sentry a tus estados
    const statusMap = {
        'unresolved': 'unresolved',
        'resolved': 'resolved',
        'ignored': 'ignored'
    };
    return statusMap[sentryEvent.status] || 'unresolved';
}

function getTagValue(tags, key) {
    const tag = tags?.find(([tagKey]) => tagKey === key);
    return tag ? tag[1] : null;
}

function generateShortId(sentryEvent) {
    // Generar un ID corto basado en el issue_id o crear uno
    return `JS-${sentryEvent.issue_id.slice(-6).toUpperCase()}`;
}

// 4. Evaluación y creación de incidencia
async function evaluateAndCreateIncident(sentryEvent, eventRecord, triggeredRule) {
    // Reglas para determinar si crear incidencia
    const shouldCreateIncident = (
        sentryEvent.level === 'error' || sentryEvent.level === 'fatal'
    ) && (
            sentryEvent.exception?.values?.[0]?.mechanism?.handled === false
        ) && (
            triggeredRule !== null // Se disparó una regla de alerta
        );

    if (!shouldCreateIncident) {
        return null;
    }

    // Verificar si ya existe incidencia para este evento
    let existingIncident = await findIncidentByEventId(eventRecord.id);
    if (existingIncident) {
        return existingIncident;
    }

    // Crear nueva incidencia
    const incidentData = {
        id: generateId(),
        code: await generateIncidentCode(),
        title: sentryEvent.title,
        event_id: eventRecord.id,
        state_id: await getStateIdByName('new'),
        category_id: await getCategoryByLevel(sentryEvent.level),
        created_by: await getSystemUserId(),
        tags: extractIncidentTags(sentryEvent),
        created_at: new Date()
    };

    const incident = await createIncident(incidentData);

    // Crear entrada en historial
    await createHistorialEstado({
        incidencia_id: incident.id,
        by: incidentData.created_by,
        from_id: null,
        to_id: incidentData.state_id,
        note: `Incident created automatically from rule: ${triggeredRule}`,
        at: new Date()
    });

    return incident;
}

function extractIncidentTags(sentryEvent) {
    const tags = [];

    // Extraer tags útiles del evento
    if (sentryEvent.platform) tags.push(`platform:${sentryEvent.platform}`);
    if (sentryEvent.level) tags.push(`level:${sentryEvent.level}`);

    const environment = getTagValue(sentryEvent.tags, 'environment');
    if (environment) tags.push(`env:${environment}`);

    const browser = getTagValue(sentryEvent.tags, 'browser.name');
    if (browser) tags.push(`browser:${browser}`);

    return tags;
}