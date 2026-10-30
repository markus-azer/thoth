# Reusable runner. Each service sets MIGRATIONS to its SQL dir.
FROM flyway/flyway:13.11.1-alpine
ARG MIGRATIONS
COPY ${MIGRATIONS} /flyway/sql
CMD ["-connectRetries=10", "migrate"]
