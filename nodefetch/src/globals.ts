export class Globals {
    static ApiKey = process.env.API_KEY || '956d9a7fedb23ad3a1a36462d8fdb2be911aab80';
    static ApiBaseUrl = process.env.API_BASE_URL || 'http://api.localhost:8000/';
    
    private constructor() {
    }
}