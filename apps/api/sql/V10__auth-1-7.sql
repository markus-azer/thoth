ALTER TABLE "jwks"
    ADD COLUMN "alg" text,
    ADD COLUMN "crv" text;

ALTER TABLE "oauthClient"
    ADD COLUMN "clientDiscoveryId" text,
    ADD COLUMN "clientCredentialsScopes" jsonb,
    ADD COLUMN "backchannelLogoutUri" text,
    ADD COLUMN "backchannelLogoutSessionRequired" boolean,
    ADD COLUMN "applicationType" text,
    ADD COLUMN "jwks" text,
    ADD COLUMN "jwksUri" text,
    ADD COLUMN "dpopBoundAccessTokens" boolean;

CREATE TABLE "oauthResource" (
    "id" text NOT NULL PRIMARY KEY,
    "identifier" text NOT NULL UNIQUE,
    "name" text NOT NULL,
    "accessTokenTtl" integer,
    "refreshTokenTtl" integer,
    "signingAlgorithm" text,
    "signingKeyId" text,
    "allowedScopes" jsonb,
    "customClaims" jsonb,
    "dpopBoundAccessTokensRequired" boolean,
    "disabled" boolean,
    "createdAt" timestamptz,
    "updatedAt" timestamptz,
    "policyVersion" integer,
    "metadata" jsonb
);

CREATE TABLE "oauthClientResource" (
    "id" text NOT NULL PRIMARY KEY,
    "clientId" text NOT NULL REFERENCES "oauthClient" ("clientId") ON DELETE CASCADE,
    "resourceId" text NOT NULL REFERENCES "oauthResource" ("identifier") ON DELETE CASCADE,
    "metadata" jsonb,
    "createdAt" timestamptz
);

CREATE INDEX "oauthClientResource_clientId_idx" ON "oauthClientResource" ("clientId");
CREATE INDEX "oauthClientResource_resourceId_idx" ON "oauthClientResource" ("resourceId");

ALTER TABLE "oauthRefreshToken"
    ADD COLUMN "authorizationCodeId" text,
    ADD COLUMN "resources" jsonb,
    ADD COLUMN "requestedUserInfoClaims" jsonb,
    ADD COLUMN "rotatedAt" timestamptz,
    ADD COLUMN "rotationReplayResponse" text,
    ADD COLUMN "rotationReplayExpiresAt" timestamptz,
    ADD COLUMN "confirmation" jsonb;

ALTER TABLE "oauthAccessToken"
    ADD COLUMN "authorizationCodeId" text,
    ADD COLUMN "resources" jsonb,
    ADD COLUMN "requestedUserInfoClaims" jsonb,
    ADD COLUMN "revoked" timestamptz,
    ADD COLUMN "confirmation" jsonb;

ALTER TABLE "oauthConsent"
    ADD COLUMN "resources" jsonb,
    ADD COLUMN "requestedUserInfoClaims" jsonb;

CREATE TABLE "oauthClientAssertion" (
    "id" text NOT NULL PRIMARY KEY,
    "expiresAt" timestamptz NOT NULL
);
