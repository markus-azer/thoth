# Reusable runner. Each service sets MIGRATIONS to its SQL dir.
FROM flyway/flyway:13.0.0-alpine
ARG MIGRATIONS
COPY ${MIGRATIONS} /flyway/sql
CMD ["migrate", "-connectRetries=10"]
