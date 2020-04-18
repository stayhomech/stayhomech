const client = require('prom-client');

// Prefix
const STATS_PREFIX = 'stayhome_statsbot_';

// Default metrics
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ prefix: STATS_PREFIX + 'default_' });

// Stats
const STATS = {
    starts: new client.Counter({
        name: STATS_PREFIX + 'starts',
        help: 'Application starts',
        labelNames: ['npa', 'city', 'language', 'agent']
    }),
    displays: {
        delay: new client.Summary({
            name: STATS_PREFIX + 'displays_delay',
            help: 'Application load delay',
            labelNames: ['npa', 'city', 'language', 'agent'],
        }),
        results: new client.Summary({
            name: STATS_PREFIX + 'displays_results',
            help: 'Application shown results',
            labelNames: ['npa', 'city', 'language', 'agent'],
        }),
        categories: new client.Summary({
            name: STATS_PREFIX + 'displays_categories',
            help: 'Application shown categories',
            labelNames: ['npa', 'city', 'language', 'agent'],
        }),
        min_range: new client.Summary({
            name: STATS_PREFIX + 'displays_min_range',
            help: 'Application closer result',
            labelNames: ['npa', 'city', 'language', 'agent'],
        }),
        max_range: new client.Summary({
            name: STATS_PREFIX + 'displays_max_range',
            help: 'Application furthest result',
            labelNames: ['npa', 'city', 'language', 'agent'],
        }),
    },
    category: new client.Counter({
        name: STATS_PREFIX + 'category',
        help: 'Categories selections',
        labelNames: ['npa', 'city', 'language', 'agent', 'category']
    }),
    business: new client.Counter({
        name: STATS_PREFIX + 'business',
        help: 'Business card deployed',
        labelNames: ['npa', 'city', 'language', 'agent', 'business']
    }),
    clicks: new client.Counter({
        name: STATS_PREFIX + 'clicks',
        help: 'Business link clicked',
        labelNames: ['npa', 'city', 'language', 'agent', 'business', 'type']
    }),
    sessions: {
        events: new client.Summary({
            name: STATS_PREFIX + 'sessions_events',
            help: 'Number of events in session',
            labelNames: ['npa', 'city', 'language', 'agent'],
        }),
        categories: new client.Summary({
            name: STATS_PREFIX + 'sessions_categories',
            help: 'Number of categories view in session',
            labelNames: ['npa', 'city', 'language', 'agent'],
        }),
        businesses: new client.Summary({
            name: STATS_PREFIX + 'sessions_businesses',
            help: 'Number of businesses deployed in session',
            labelNames: ['npa', 'city', 'language', 'agent'],
        }),
        clicks: new client.Summary({
            name: STATS_PREFIX + 'sessions_clicks',
            help: 'Number of clicks in session',
            labelNames: ['npa', 'city', 'language', 'agent'],
        }),
        duration: new client.Summary({
            name: STATS_PREFIX + 'sessions_duration',
            help: 'Time between session start and last event',
            labelNames: ['npa', 'city', 'language', 'agent'],
        }),
        active: new client.Gauge({
            name: STATS_PREFIX + 'sessions_active',
            help: 'Number of active sessions',
        }),
    }
}

const metrics = () => {
    return client.register.metrics();
}

module.exports = {
    STATS,
    metrics
}