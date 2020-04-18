const express = require("express");
const bodyParser = require('body-parser');
const config = require("../config");
const _ = require('underscore');
const { STATS, metrics } = require('./stats');
const { v4: uuidv4 } = require('uuid');

class StatsBot {

    constructor() {

        // Public ingest endpoint
        this.publicServer = express();
        this.publicServer.use(bodyParser.urlencoded({ extended: false }));
        this.publicServer.use(bodyParser.json());

        // Private metrics endpoint
        this.privateServer = express();
        this.privateServer.use(bodyParser.urlencoded({ extended: false }));
        this.privateServer.use(bodyParser.json());

        // Sessions
        this.sessions = {};
        this.session_timeout = 300 * 1000;
        setInterval(() => {
            this.clearSessions();
        }, this.session_timeout / 10);

        // Exit event
        process.on('exit', this.clearSessions);

    }

    clearSessions() {
        const now = Date.now();
        let cleaned = 0;
        let total = 0;
        _.keys(this.sessions).forEach((key) => {
            if (this.sessions[key].last < (now - this.session_timeout)) {

                // Get session
                const session = this.sessions[key];

                // Stats
                STATS.sessions.events.labels(...session.labels).observe(session.events);
                STATS.sessions.categories.labels(...session.labels).observe(session.categories);
                STATS.sessions.businesses.labels(...session.labels).observe(session.businesses);
                STATS.sessions.clicks.labels(...session.labels).observe(session.clicks);
                STATS.sessions.duration.labels(...session.labels).observe(session.last - session.start);

                delete this.sessions[key];
                cleaned += 1;
            } else {
                total += 1;
            }
        });

        // Stats
        STATS.sessions.active.set(total);

        // Log
        if (cleaned > 0) {
            const date = new Date();
            console.log('[' + date.toLocaleString() + '] Sessions cleaning removed ' + cleaned + ' sessions. ' + total + ' active sessions remaining.');
        }

    }

    run() {
        this.runPublicServer();
        this.runPrivateServer();
    }

    runPublicServer() {

        // Single event handler
        this.publicServer.post('/event', (req, res) => {

            // Handler
            this.eventHandler(req.body, req.headers)
                .then(result => {
                    res.json({
                        success: true,
                        response: result
                    });
                })
                .catch(e => {
                    res.json({
                        success: false,
                        response: e.toString()
                    })
                })

        });

        // Multiple events handler
        this.publicServer.post('/events', (req, res) => {

            if (!Array.isArray(req.body)) {
                return res.json({
                    success: false,
                    response: 'Request body must be an array.'
                })
            }

            // Log
            const date = new Date();
            console.log('[' + date.toLocaleString() + '] Got events query with ' + req.body.length + ' events.');

            // Handlers
            let handlers = [];
            req.body.forEach((event) => { handlers.push(this.eventHandler(event, req.headers)) });

            // Handler
            Promise.all(handlers)
                .then(results => {
                    res.json({
                        success: true,
                        response: results
                    });
                })
                .catch(e => {
                    console.log('[' + date.toLocaleString() + '] Got an error while processing events: ' + e.toString());
                    res.json({
                        success: false,
                        response: e.toString()
                    })
                })

        });

        // Check for LB
        this.publicServer.get('/check', (req, res) => {
            res.send('OK');
        });

        // Listen
        this.publicServer.listen(config.PUBLIC_PORT, () => {
            console.log("Statsbot public endpoint listening on port " + config.PUBLIC_PORT);
        });

    }

    runPrivateServer() {

        // Prometheus metrics
        this.privateServer.get('/metrics', (req, res) => {
            res.set('Content-Type', 'text/plain; charset=utf-8');
            res.send(metrics());
        });

        // Listen
        this.privateServer.listen(config.PRIVATE_PORT, () => {
            console.log("Statsbot private endpoint listening on port " + config.PRIVATE_PORT);
        });

    }

    checkEventPayload(event, required_keys) {

        // Type-specific content
        let in_both = _.intersection(_.keys(event.payload, required_keys));
        return in_both.length === required_keys.length;

    }

    checkSid(sid) {
        if (_.keys(this.sessions).includes(sid)) {
            this.sessions[sid].events += 1;
            this.sessions[sid].last = Date.now();
            return true;
        }
        return false;
    }

    async eventHandler(event, headers) {

        // Promise
        return new Promise((resolve, reject) => {

            // Base content
            if (!Object.keys(event).includes('type') || !Object.keys(event).includes('payload')) {
                reject('Malformed event. Missing type or payload.');
            }

            // Required keys
            let required_keys = [];

            // Session
            let session = {};

            // Date
            let date = new Date();

            switch (event.type) {

                // Application is started
                case 'start':

                    // Required content
                    required_keys = [
                        'npa',  // Postal code
                        'city', // City name
                        'lang'  // Language
                    ];
                    this.checkEventPayload(event, required_keys) || reject('Malformed start payload. Missing required content.');

                    // Stats
                    STATS.starts.labels(event.payload.npa, decodeURIComponent(event.payload.city), event.payload.lang, headers['user-agent']).inc();

                    // Session
                    const sid = uuidv4();
                    this.sessions[sid] = {
                        start: Date.now(),
                        last: Date.now(),
                        labels: [
                            event.payload.npa,
                            decodeURIComponent(event.payload.city),
                            event.payload.lang,
                            headers['user-agent']
                        ],
                        events: 0,
                        categories: 0,
                        businesses: 0,
                        clicks: 0,
                    }

                    // Log
                    console.log('[' + date.toLocaleString() + '] ' + sid + ' START ' + event.payload.npa + ' "' + decodeURIComponent(event.payload.city) + '" ' + event.payload.lang + ' "' + headers['user-agent'] + '"');

                    // Finish
                    resolve({
                        sid: sid
                    })

                    break;

                // Results page is shown
                case 'display':

                    // Required content
                    required_keys = [
                        'sid',          // Session ID
                        'delay',        // Delays to load results
                        'results',      // Count of results
                        'categories',   // Count of categories
                        'min_range',    // Closest result
                        'max_range',    // Farest result
                    ];
                    this.checkEventPayload(event, required_keys) || reject('Malformed display payload. Missing required content.');

                    // Session
                    this.checkSid(event.payload.sid) || reject('Unknown SID.');
                    session = this.sessions[event.payload.sid];

                    // Stats
                    STATS.displays.delay.labels(...session.labels).observe(event.payload.delay);
                    STATS.displays.results.labels(...session.labels).observe(event.payload.results);
                    STATS.displays.categories.labels(...session.labels).observe(event.payload.categories);
                    STATS.displays.min_range.labels(...session.labels).observe(event.payload.min_range);
                    STATS.displays.max_range.labels(...session.labels).observe(event.payload.max_range);

                    // Log
                    console.log('[' + date.toLocaleString() + '] ' + event.payload.sid + ' DISPLAY ' + event.payload.delay + ' ' + event.payload.results + ' ' + event.payload.categories + ' ' + event.payload.min_range + ' ' + event.payload.max_range);

                    // Finish
                    resolve({});

                    break;

                // Category is chosen
                case 'category':

                    // Required content
                    required_keys = [
                        'sid',      // Session ID
                        'category', // Category ID
                    ];
                    this.checkEventPayload(event, required_keys) || reject('Malformed category payload. Missing required content.');

                    // Session
                    this.checkSid(event.payload.sid) || reject('Unknown SID.');
                    session = this.sessions[event.payload.sid];
                    session.categories += 1;

                    // Stats
                    STATS.category.labels(..._.union(session.labels, [event.payload.category])).inc();

                    // Log
                    console.log('[' + date.toLocaleString() + '] ' + event.payload.sid + ' CATEGORY ' + event.payload.category);

                    // Finish
                    resolve({});

                    break;

                // Card is deployed
                case 'deployed':

                    // Required content
                    required_keys = [
                        'sid',      // Session ID
                        'business', // Business ID
                    ];
                    this.checkEventPayload(event, required_keys) || reject('Malformed deployed payload. Missing required content.');

                    // Session
                    this.checkSid(event.payload.sid) || reject('Unknown SID.');
                    session = this.sessions[event.payload.sid];
                    session.businesses += 1;

                    // Stats
                    STATS.business.labels(..._.union(session.labels, [event.payload.business])).inc();

                    // Log
                    console.log('[' + date.toLocaleString() + '] ' + event.payload.sid + ' DEPLOYED ' + event.payload.business);

                    // Finish
                    resolve({});

                    break;

                // Click on outgoing link
                case 'click':

                    // Required content
                    required_keys = [
                        'sid',      // Session ID
                        'business', // Business ID
                        'link'      // Type of link
                    ];
                    this.checkEventPayload(event, required_keys) || reject('Malformed click payload. Missing required content.');

                    // Session
                    this.checkSid(event.payload.sid) || reject('Unknown SID.');
                    session = this.sessions[event.payload.sid];
                    session.clicks += 1;

                    // Stats
                    STATS.clicks.labels(..._.union(session.labels, [event.payload.business, event.payload.link])).inc();

                    // Log
                    console.log('[' + date.toLocaleString() + '] ' + event.payload.sid + ' CLICK ' + event.payload.business + ' ' + event.payload.link);

                    // Finish
                    resolve({});

                    break;

                // Unknown type
                default:
                    reject('Unknown event type ' + event.type);

            }

        });

    }

}

module.exports = StatsBot
