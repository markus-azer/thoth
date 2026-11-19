# Reusable runner. Each service sets MIGRATIONS to its SQL dir.
FROM flyway/flyway:13.12.2-alpine
ARG MIGRATIONS
COPY ${MIGRATIONS} /flyway/sql
CMD ["-connectRetries=10", "migrate"]
