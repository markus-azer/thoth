CREATE TABLE "user" (
    "id" text NOT NULL PRIMARY KEY,
    "name" text NOT NULL,
    "email" text NOT NULL UNIQUE,
    "emailVerified" boolean NOT NULL,
    "image" text,
    "createdAt" timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE "session" (
    "id" text NOT NULL PRIMARY KEY,
    "expiresAt" timestamptz NOT NULL,
    "token" text NOT NULL UNIQUE,
    "createdAt" timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamptz NOT NULL,
    "ipAddress" text,
    "userAgent" text,
    "userId" text NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE
);

CREATE INDEX "session_userId_idx" ON "session" ("userId");

CREATE TABLE "account" (
    "id" text NOT NULL PRIMARY KEY,
    "accountId" text NOT NULL,
    "providerId" text NOT NULL,
    "userId" text NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
    "accessToken" text,
    "refreshToken" text,
    "idToken" text,
    "accessTokenExpiresAt" timestamptz,
    "refreshTokenExpiresAt" timestamptz,
    "scope" text,
    "password" text,
    "createdAt" timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamptz NOT NULL
);

CREATE INDEX "account_userId_idx" ON "account" ("userId");

CREATE TABLE "verification" (
    "id" text NOT NULL PRIMARY KEY,
    "identifier" text NOT NULL,
    "value" text NOT NULL,
    "expiresAt" timestamptz NOT NULL,
    "createdAt" timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX "verification_identifier_idx" ON "verification" ("identifier");

CREATE TABLE "jwks" (
    "id" text NOT NULL PRIMARY KEY,
    "publicKey" text NOT NULL,
    "privateKey" text NOT NULL,
    "createdAt" timestamptz NOT NULL,
    "expiresAt" timestamptz
);

CREATE TABLE "oauthClient" (
    "id" text NOT NULL PRIMARY KEY,
    "clientId" text NOT NULL UNIQUE,
    "clientSecret" text,
    "disabled" boolean,
    "skipConsent" boolean,
    "enableEndSession" boolean,
    "subjectType" text,
    "scopes" jsonb,
    "userId" text REFERENCES "user" ("id") ON DELETE CASCADE,
    "createdAt" timestamptz,
    "updatedAt" timestamptz,
    "name" text,
    "uri" text,
    "icon" text,
    "contacts" jsonb,
    "tos" text,
    "policy" text,
    "softwareId" text,
    "softwareVersion" text,
    "softwareStatement" text,
    "redirectUris" jsonb NOT NULL,
    "postLogoutRedirectUris" jsonb,
    "tokenEndpointAuthMethod" text,
    "grantTypes" jsonb,
    "responseTypes" jsonb,
    "public" boolean,
    "type" text,
    "requirePKCE" boolean,
    "referenceId" text,
    "metadata" jsonb
);

CREATE INDEX "oauthClient_userId_idx" ON "oauthClient" ("userId");

CREATE TABLE "oauthRefreshToken" (
    "id" text NOT NULL PRIMARY KEY,
    "token" text NOT NULL UNIQUE,
    "clientId" text NOT NULL REFERENCES "oauthClient" ("clientId") ON DELETE CASCADE,
    "sessionId" text REFERENCES "session" ("id") ON DELETE SET NULL,
    "userId" text NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
    "referenceId" text,
    "expiresAt" timestamptz NOT NULL,
    "createdAt" timestamptz NOT NULL,
    "revoked" timestamptz,
    "authTime" timestamptz,
    "scopes" jsonb NOT NULL
);

CREATE INDEX "oauthRefreshToken_clientId_idx" ON "oauthRefreshToken" ("clientId");
CREATE INDEX "oauthRefreshToken_sessionId_idx" ON "oauthRefreshToken" ("sessionId");
CREATE INDEX "oauthRefreshToken_userId_idx" ON "oauthRefreshToken" ("userId");

CREATE TABLE "oauthAccessToken" (
    "id" text NOT NULL PRIMARY KEY,
    "token" text NOT NULL UNIQUE,
    "clientId" text NOT NULL REFERENCES "oauthClient" ("clientId") ON DELETE CASCADE,
    "sessionId" text REFERENCES "session" ("id") ON DELETE SET NULL,
    "userId" text REFERENCES "user" ("id") ON DELETE CASCADE,
    "referenceId" text,
    "refreshId" text REFERENCES "oauthRefreshToken" ("id") ON DELETE CASCADE,
    "expiresAt" timestamptz NOT NULL,
    "createdAt" timestamptz NOT NULL,
    "scopes" jsonb NOT NULL
);

CREATE INDEX "oauthAccessToken_clientId_idx" ON "oauthAccessToken" ("clientId");
CREATE INDEX "oauthAccessToken_sessionId_idx" ON "oauthAccessToken" ("sessionId");
CREATE INDEX "oauthAccessToken_userId_idx" ON "oauthAccessToken" ("userId");
CREATE INDEX "oauthAccessToken_refreshId_idx" ON "oauthAccessToken" ("refreshId");

CREATE TABLE "oauthConsent" (
    "id" text NOT NULL PRIMARY KEY,
    "clientId" text NOT NULL REFERENCES "oauthClient" ("clientId") ON DELETE CASCADE,
    "userId" text REFERENCES "user" ("id") ON DELETE CASCADE,
    "referenceId" text,
    "scopes" jsonb NOT NULL,
    "createdAt" timestamptz NOT NULL,
    "updatedAt" timestamptz NOT NULL
);

CREATE INDEX "oauthConsent_clientId_idx" ON "oauthConsent" ("clientId");
CREATE INDEX "oauthConsent_userId_idx" ON "oauthConsent" ("userId");
