import axios from 'axios';


const EventsManager =  {

    // Start
    start: (npa, city, lang) => {
        
        // Global
        window.EMeventsPile = [];
        window.EMeventsConfig = {
            interval: undefined,
            sid: undefined,
        }

        // Send events periodicly
        window.EMsendEvents = () => {

            // Quick exit
            if (window.EMeventsPile.length === 0) {
                return;
            }

            // Get events
            let events = [];
            while (window.EMeventsPile.length > 0) {
                events.push(window.EMeventsPile.shift());
            }

            // Add SID to events
            events.forEach((event, index, table) => {
                event.payload.sid = window.EMeventsConfig.sid;
                table[index] = event;
            });

            // Post
            axios.post(
                '/stats/events',
                events
            )
            .catch((e) => {
                console.debug(e);
            });

        }

        // Events
        window.addEventListener('close', e => window.EMsendEvents());
        document.addEventListener('visibilitychange', e => window.EMsendEvents());

        // Sending interval
        window.EMeventsConfig.interval = setInterval(window.EMsendEvents, 30 * 1000);

        // Start session
        return axios.post(
            '/stats/event',
            {
                type: 'start',
                payload: {
                    npa: npa,
                    city: city,
                    lang: lang
                }
            }
        )
        .then((result) => {
            if (result.data.success) {
                window.EMeventsConfig.sid = result.data.response.sid;
            }
        })
        .catch((e) => {
            console.debug(e);
        })
    }

}

export default EventsManager;
