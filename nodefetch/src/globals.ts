export class Globals {
    static SyncServiceBaseUrl = process.env.SYNC_SERVICE_BASE_URL || 'http://sync-service/api/';
    
    private constructor() {
    }
}