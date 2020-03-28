# Original mariadb container
FROM mariadb

# Add local configuration
COPY utf8mb4.cnf /etc/mysql/conf.d/utf8mb4.cnf
RUN chmod 644 /etc/mysql/conf.d/utf8mb4.cnf