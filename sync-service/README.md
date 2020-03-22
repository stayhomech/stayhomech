# Sync Service

Json Model:

    {
      "id": "string",
      "providerName": "string",
      "name": "string",
      "description": "string",
      "contact": "string",
      "location": "string",
      "email": "string",
      "phone": "string",
      "delivery": "string",
      "categories": "string",
      "ttl": 0,
      "website": "string"
    }

Model Description:

Field |  Type | Description
:--- | :---: | :---
**id** | string | -
**providerName** | string | 
**name** | string | -
**description** | string | -
contact | string | free text field if none of the other fields (eg. email, website, location) fits
location | string | -
email | string | -
phone | string | -
delivery | string | -
website | string | -
categories | string | -
ttl | number | In seconds. The datasource providers defines how long the entry shall be available. each time the provider sends the data again to the sync-service the ttl is renewed

Fields in bold are mandatory.


# Usage

Curl:

    curl -X POST "http://localhost:8080/api/business-entry/" \
        -H "Content-Type: application/json" \
        -d '{
              "categories": "string",
              "contact": "string",
              "delivery": "string",
              "description": "string",
              "email": "string",
              "id": "string",
              "location": "string",
              "name": "string",
              "phone": "string",
              "providerName": "string",
              "ttl": 1000,
              "website": "string"
            }'


Swagger-UI:

http://localhost:8080/swagger-ui.html
