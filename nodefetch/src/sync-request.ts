export interface SyncRequest {
    id: string;
    providerName: string;
    name: string;
    description: string;
    contact?: string; // free text field if none of the other fields (eg. email, website, location) fits
    location?: string;
    email?: string;
    phone?: string;
    delivery?: string;
    website?: string;
    categories?: string;
    ttl?: number; // in seconds
}