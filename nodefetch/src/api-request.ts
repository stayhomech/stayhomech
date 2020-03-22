export interface ApiRequest
{
    ttl: number;
    source_uuid?: string;
    name: string;
    description: string;
    website?: string;
    phone?: string;
    email?: string;
    category?: string;
    delivery?: string;
}