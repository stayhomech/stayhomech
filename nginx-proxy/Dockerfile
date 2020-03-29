# Original nginx-proxy container
FROM jwilder/nginx-proxy

# New configuration template        
COPY ./nginx.tmpl /app/nginx.tmpl

# Default error page
COPY ./50x.html /usr/share/nginx/html/50x.html

# Custom configurations
COPY ./stayhome.ch /etc/nginx/vhost.d/stayhome.ch
COPY ./www.stayhome.ch /etc/nginx/vhost.d/www.stayhome.ch
COPY ./preview.stayhome.ch /etc/nginx/vhost.d/preview.stayhome.ch
