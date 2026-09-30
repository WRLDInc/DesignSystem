# wrld.design auth.md

You are an agent. This document is the self-contained registration guide for
WRLD identity, published per the [Auth.md protocol](https://github.com/workos/auth.md):
discover → pick a method → register → exchange for an `access_token` → call
the API → handle revocation. The machine-readable half is
[`/.well-known/oauth-protected-resource`](https://wrld.design/.well-known/oauth-protected-resource).

Hosts: `https://wrld.design` is the resource you are reading (the WRLD design
system). `https://auth.wrld.tech/` is the authorization server every WRLD
surface trusts. The authorization server is a standard OAuth 2.0 / OpenID
Connect issuer; it does **not** publish an `agent_auth` block or the
`/agent/identity` profile endpoints, so every step below uses its standard
RFC endpoints and this document is the source of truth for the mapping.

## Step 0 — Reading the design system needs no credentials

Everything served from `https://wrld.design` is public, read-only and
CORS-open. There is no API key, no bearer token and no rate plan, and the
origin never answers `401`. Content signals in
[`/robots.txt`](https://wrld.design/robots.txt) allow `search`, `ai-input`
and `ai-train`. Start with [`/llms.txt`](https://wrld.design/llms.txt) or the
catalog at [`/.well-known/api-catalog`](https://wrld.design/.well-known/api-catalog).
Do not send credentials to this origin; it cannot use them.

Continue only if you are **building** a WRLD surface (a dashboard, a client
portal, an internal tool) and need a WRLD identity for it, or need to implement
its sign-in. For the sign-in itself, read
[`docs/LOGIN_DESIGN.md`](https://wrld.design/docs/LOGIN_DESIGN.md) after this.

## Step 1 — Discover

### 1a. Fetch the Protected Resource Metadata

```http
GET https://wrld.design/.well-known/oauth-protected-resource
```

Fields: `resource` (`https://wrld.design`), `authorization_servers`
(`["https://auth.wrld.tech/"]`), `scopes_supported`
(`openid profile email offline_access`), `bearer_methods_supported`
(`["header"]`), and an `agent_auth` block that restates the endpoints named in
Step 3 with `skill` pointing back at this document.

### 1b. Fetch the Authorization Server metadata

```http
GET https://auth.wrld.tech/.well-known/oauth-authorization-server
```

Read these fields and use them instead of any URL you remember:

- `issuer` — `https://auth.wrld.tech/`. Validate the `iss` claim of every token against this exact string, trailing slash included.
- `registration_endpoint` — dynamic client registration (Step 3, `anonymous`).
- `device_authorization_endpoint` — the claim ceremony for a human owner (Step 3, `service_auth`).
- `token_endpoint` — where every method ends up exchanging for an `access_token` (Step 5).
- `revocation_endpoint` — RFC 7009 revocation (Revocation).
- `jwks_uri` — keys for validating what the issuer signs.
- `grant_types_supported` — includes `authorization_code`, `client_credentials`, `refresh_token`, `urn:ietf:params:oauth:grant-type:device_code`, `urn:ietf:params:oauth:grant-type:jwt-bearer` and `urn:ietf:params:oauth:grant-type:token-exchange`.
- `authorization_grant_profiles_supported` — includes `urn:ietf:params:oauth:grant-profile:id-jag`, which is what makes `identity_assertion` possible.
- `code_challenge_methods_supported` — use `S256`.

`https://login.wrld.tech/` is an alias of the same tenant and publishes the
same metadata; prefer `auth.wrld.tech`.

## Step 2 — Pick a method

`identity_types_supported` for WRLD: `anonymous`, `service_auth`,
`identity_assertion`. Use this decision tree:

1. **You hold a session tied to a user in a trusted enterprise identity provider and can mint an ID-JAG audience-bound to a WRLD resource** → [identity_assertion + id-jag](#identity_assertion--id-jag).
2. **You act on behalf of a specific human who can open a browser** → [service_auth](#service_auth). Claim ceremony required (device authorization).
3. **You have neither, or you act as yourself** → [anonymous](#anonymous). Registers a client; a human can take ownership later through `service_auth`.

Before asserting a user's identity to WRLD (methods 1 and 2), surface
`resource_name` from Step 1a and the scopes you will act under, and confirm
with the user. That is their consent gate.

## Step 3 — Register

### anonymous

Dynamic client registration ([RFC 7591](https://datatracker.ietf.org/doc/html/rfc7591)
/ OpenID Connect DCR) at the `registration_endpoint`:

```http
POST https://auth.wrld.tech/oidc/register
Content-Type: application/json

{
  "client_name": "<your agent, human-readable>",
  "redirect_uris": ["https://<your-surface>/callback"],
  "token_endpoint_auth_method": "none",
  "grant_types": ["authorization_code", "refresh_token"],
  "response_types": ["code"]
}
```

Response (201): a `client_id` for a public client. Registration is subject
to tenant policy: a `403` or `access_denied` means registration is closed to
unknown agents. Do not retry; use `service_auth` with a human, or ask through
<https://wrld.tech/contact>.

Pre-claim scopes: none of the user scopes. The client can only start Step 5
flows that a human completes. There is no `identity_assertion` in this
response; ownership is established in the claim ceremony.

### service_auth

WRLD's claim ceremony is standard [RFC 8628 device authorization](https://datatracker.ietf.org/doc/html/rfc8628)
at the `device_authorization_endpoint`, using the `client_id` from `anonymous`
or one WRLD provisioned for you:

```http
POST https://auth.wrld.tech/oauth/device/code
Content-Type: application/x-www-form-urlencoded

client_id=<client_id>&scope=openid%20profile%20email%20offline_access&audience=<resource>
```

Response (200): `device_code`, `user_code`, `verification_uri`,
`verification_uri_complete`, `expires_in`, `interval`. Surface
`verification_uri_complete` (or `verification_uri` plus `user_code`) to the
user; they sign in on a page WRLD owns and confirm the code. Poll the
`token_endpoint` with
`grant_type=urn:ietf:params:oauth:grant-type:device_code` honouring
`interval`; `authorization_pending` and `slow_down` mean keep waiting,
`expired_token` means restart this step. On success you hold an
`access_token`, an `id_token` and, if you asked for `offline_access`, a
`refresh_token`. Post-claim scopes are the ones you requested and the user
approved.

### identity_assertion + id-jag

Confirm your identity provider is on WRLD's trust list (it is configured per
enterprise connection in the tenant; if you are not sure, it is not, and you
should fall back to `service_auth`). Mint an ID-JAG per the
[Identity Assertion Authorization Grant](https://datatracker.ietf.org/doc/draft-ietf-oauth-identity-assertion-authz-grant/)
with `aud` set to `https://auth.wrld.tech/` and `resource` set to the WRLD
resource you will call, then go straight to Step 5 with
`grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer`. No claim ceremony:
the user's session at your provider is the consent.

### Pre-provisioned confidential clients

For an agent that acts as itself on a schedule (a sync engine, a job), WRLD
issues a confidential client with `client_credentials` or `private_key_jwt`
authentication. Request one through <https://wrld.tech/contact>, naming the
surface, the scopes and the data you will touch. Secrets are delivered out of
band, never in chat or email. Exchange at Step 5 with
`grant_type=client_credentials`.

## Step 4 — Claim ceremony

Only `service_auth` has one, and it is bundled into Step 3 above (device
authorization). There is no separate claim endpoint and no `claim_token`;
the `device_code` plays that role and is single-use. Do not persist it past
the ceremony.

## Step 5 — Exchange for an access_token

Every method ends here:

```http
POST https://auth.wrld.tech/oauth/token
Content-Type: application/x-www-form-urlencoded
```

| Method | `grant_type` | Also send |
| --- | --- | --- |
| `anonymous` public client, browser available | `authorization_code` | `code`, `code_verifier` (PKCE `S256`), `redirect_uri`, `client_id` |
| `service_auth` | `urn:ietf:params:oauth:grant-type:device_code` | `device_code`, `client_id` |
| `identity_assertion` | `urn:ietf:params:oauth:grant-type:jwt-bearer` | `assertion=<ID-JAG>`, `client_id` |
| Confidential client | `client_credentials` | client authentication, `audience` |

Response (200): `access_token`, `token_type: Bearer`, `expires_in`, optional
`refresh_token` and `id_token`.

## Step 6 — Use the access_token

Present it only as a bearer header; `bearer_methods_supported` is `header`,
and query strings or form bodies are rejected:

```http
GET https://<wrld-surface>/api/...
Authorization: Bearer <access_token>
```

**Refresh.** When `expires_in` elapses, use the `refresh_token` at the
`token_endpoint` with `grant_type=refresh_token` if you hold one; otherwise
re-run Step 5 (`client_credentials`, or a fresh ID-JAG). A `401` on a
previously working token: refresh once, then restart at Step 3.

Validate `iss` (`https://auth.wrld.tech/`), `aud` (the resource you were told
to call), `exp` and the signature against `jwks_uri` on every token you
accept in your own service.

## Errors

Registration and device errors use standard OAuth vocabulary.

| Code | Where | What to do |
| --- | --- | --- |
| `access_denied` / `403` | `registration_endpoint` | Dynamic registration is closed to unknown agents. Use `service_auth` with a human, or ask through <https://wrld.tech/contact>. |
| `invalid_redirect_uri` | `registration_endpoint` | Every `redirect_uris` entry must be `https` and exact. Fix and resend. |
| `unauthorized_client` | `device_authorization_endpoint` | The client is not allowed the device grant. Use a browser flow, or ask for the grant to be enabled. |
| `authorization_pending` | `token_endpoint` (device grant) | The user has not finished. Wait `interval`, poll again. |
| `slow_down` | `token_endpoint` (device grant) | Add at least 5 seconds to `interval`. |
| `expired_token` | `token_endpoint` (device grant) | The `user_code` window closed. Restart Step 3 `service_auth`. |
| `invalid_grant` | `token_endpoint` | Code, assertion or refresh token expired, revoked or replayed. Restart at Step 3. |
| `invalid_client` | `token_endpoint` | `client_id` or client credentials not recognised. Re-read Step 1b; re-register if the client was removed. |
| `unsupported_grant_type` | `token_endpoint` | Not in `grant_types_supported`. Re-read Step 1b. |
| `429` | any | Back off exponentially and retry. |

Retry policy: 5xx → exponential backoff, same request. 4xx → do not resend
the same payload; act on the table.

## Revocation

- **Credential layer** ([RFC 7009](https://datatracker.ietf.org/doc/html/rfc7009), `revocation_endpoint`): `POST token=<refresh_token>&token_type_hint=refresh_token` (form-encoded, with client authentication) to `https://auth.wrld.tech/oauth/revoke`. Idempotent. Revoke when the agent is decommissioned or a secret may have leaked.
- **Registration layer**: WRLD can delete or block the client at the tenant. You discover it when the `token_endpoint` returns `invalid_client` or `invalid_grant`; restart at Step 3.

## Staff surfaces

Internal WRLD tools sit behind a separate access layer with no self-service
registration. An agent that is redirected to an organisation login page
instead of the issuer above has reached a staff door and should stop.

## Login design guidelines

If you are building a WRLD surface, the sign-in is a branded moment, not a
vendor default. The rules are in
[`docs/LOGIN_DESIGN.md`](https://wrld.design/docs/LOGIN_DESIGN.md) and the
reference card is
[`/preview/components-login`](https://wrld.design/preview/components-login).
The short version:

- Prefer the hosted login page of the identity provider that fronts the door. Theme it with the tokens; do not rebuild it as a custom form.
- One column, centred, the starburst mark above a sentence-case heading ("Sign in to WRLD" or "Sign in to WRLD.host"), never a marketing panel beside it.
- Monochrome surface. Accent colour appears only on focus rings, the hover state of the primary button and status text.
- "Continue with Google" is a secondary button above the email field; the primary button reads "Continue", not "Submit" or "Log in".
- Errors are inline, specific and calm. Never shake, never red-fill the card.
- Sentence case everywhere, Ubuntu for body, Montserrat for the heading, no emoji.

## Conduct

Passive discovery is welcome. Do not call the registration, device or token
endpoints without intent to register, do not enumerate accounts, and do not
automate the human sign-in pages. Report a security concern through
<https://wrld.tech/contact>.
