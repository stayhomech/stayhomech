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
        labelNames: ['language']
    }),
    displays: {
        delay: new client.Summary({
            name: STATS_PREFIX + 'displays_delay',
            help: 'Application load delay',
            percentiles: [0.01, 0.05, 0.1, 0.5, 0.9, 0.95, 0.99]
        }),
        results: new client.Summary({
            name: STATS_PREFIX + 'displays_results',
            help: 'Application shown results',
            percentiles: [0.01, 0.05, 0.1, 0.5, 0.9, 0.95, 0.99]
        }),
        categories: new client.Summary({
            name: STATS_PREFIX + 'displays_categories',
            help: 'Application shown categories',
            percentiles: [0.01, 0.05, 0.1, 0.5, 0.9, 0.95, 0.99]
        }),
        min_range: new client.Summary({
            name: STATS_PREFIX + 'displays_min_range',
            help: 'Application closer result',
            percentiles: [0.01, 0.05, 0.1, 0.5, 0.9, 0.95, 0.99]
        }),
        max_range: new client.Summary({
            name: STATS_PREFIX + 'displays_max_range',
            help: 'Application furthest result',
            percentiles: [0.01, 0.05, 0.1, 0.5, 0.9, 0.95, 0.99]
        }),
    },
    category: new client.Counter({
        name: STATS_PREFIX + 'category',
        help: 'Categories selections',
        labelNames: ['category']
    }),
    business: new client.Counter({
        name: STATS_PREFIX + 'business',
        help: 'Business card deployed',
        labelNames: ['business']
    }),
    clicks: new client.Counter({
        name: STATS_PREFIX + 'clicks',
        help: 'Business link clicked',
        labelNames: ['type']
    }),
    sessions: {
        events: new client.Summary({
            name: STATS_PREFIX + 'sessions_events',
            help: 'Number of events in session',
            percentiles: [0.01, 0.05, 0.1, 0.5, 0.9, 0.95, 0.99]
        }),
        categories: new client.Summary({
            name: STATS_PREFIX + 'sessions_categories',
            help: 'Number of categories view in session',
            percentiles: [0.01, 0.05, 0.1, 0.5, 0.9, 0.95, 0.99]
        }),
        businesses: new client.Summary({
            name: STATS_PREFIX + 'sessions_businesses',
            help: 'Number of businesses deployed in session',
            percentiles: [0.01, 0.05, 0.1, 0.5, 0.9, 0.95, 0.99]
        }),
        clicks: new client.Summary({
            name: STATS_PREFIX + 'sessions_clicks',
            help: 'Number of clicks in session',
            percentiles: [0.01, 0.05, 0.1, 0.5, 0.9, 0.95, 0.99]
        }),
        duration: new client.Summary({
            name: STATS_PREFIX + 'sessions_duration',
            help: 'Time between session start and last event',
            percentiles: [0.01, 0.05, 0.1, 0.5, 0.9, 0.95, 0.99]
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