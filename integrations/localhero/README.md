# Integration for local-hero.ch

## Development
Instead of spamming local-hero.ch with requests while developing, there is a local server located in the `mock-server`
folder that provides a handful posts copied from the actual site.

```bash
npm install
npm run json-server
```

Open `http://localhost:3001` in any browser to find the routes (currently there is only one...). The `local` SpringBoot
is configured to access this server.

