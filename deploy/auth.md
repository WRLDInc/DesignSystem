# wrld.design auth.md

Agent registration and credential guidance for the WRLD design system and the
WRLD surfaces built on it. Published per the Auth.md convention; the
machine-readable half is
[`/.well-known/oauth-protected-resource`](https://wrld.design/.well-known/oauth-protected-resource).

## Who this is for

AI agents and automated clients that either **read** the design system to
produce on-brand work, or **build** a WRLD surface (a dashboard, a client
portal, an internal tool) and therefore have to implement sign-in the way
WRLD does it. If you are here to read tokens, you can stop after the next
section. If you are here to ship a login, read to the end, then
[`docs/LOGIN_DESIGN.md`](https://wrld.design/docs/LOGIN_DESIGN.md).

## Reading the design system needs no credentials

Everything served from `https://wrld.design` is public, read-only and
CORS-open. There is no API key, no bearer token and no rate plan. Content
signals in [`/robots.txt`](https://wrld.design/robots.txt) allow `search`,
`ai-input` and `ai-train`. Start with
[`/llms.txt`](https://wrld.design/llms.txt), or the catalog at
[`/.well-known/api-catalog`](https://wrld.design/.well-known/api-catalog).

Do not send credentials to this origin. It cannot use them.

## When you need a WRLD identity

WRLD identity is issued by the authorization server advertised in the
protected resource metadata. Discover it from that document rather than from
this page; the table below is a convenience and may lag.

| Field | Value |
| --- | --- |
| Issuer | `https://auth.wrld.tech/` |
| Authorization server metadata | `https://auth.wrld.tech/.well-known/oauth-authorization-server` |
| OpenID configuration | `https://auth.wrld.tech/.well-known/openid-configuration` |
| PKCE | `S256` for public clients |
| Scopes | `openid profile email offline_access` |

Use the issuer string exactly as written, trailing slash included, when you
validate tokens. Endpoints (authorize, token, device, registration,
revocation, JWKS) are all in the metadata document.

## Registration methods

The `agent_auth` block in the protected resource metadata advertises the
supported ways to obtain a client. Pick the least privileged one that fits.

1. **Anonymous public client (dynamic registration).** Send an OpenID Connect
   Dynamic Client Registration request to the `registration_endpoint` in the
   metadata with your `redirect_uris` and `client_name`. You receive a
   `client_id` for a public client; authenticate users with the authorization
   code flow plus PKCE. Registration is subject to policy and may require
   approval: a `403` means ask, not retry.
2. **Pre-provisioned confidential client.** For an agent that acts as itself
   (a sync engine, a scheduled job), WRLD issues a client with
   `client_credentials` or `private_key_jwt` authentication. Request one
   through <https://wrld.tech/contact>, naming the surface, the scopes and the
   data you will touch. Secrets are delivered out of band.
3. **Identity assertion (ID-JAG).** The authorization server advertises the
   `urn:ietf:params:oauth:grant-profile:id-jag` grant profile. An agent that
   already holds an identity from a trusted enterprise identity provider can
   exchange an identity assertion JWT authorization grant at the token
   endpoint for a WRLD access token scoped to the resource it names. Use this
   when a human has delegated to the agent inside their own tenant.

For a human-in-the-loop sign-in on a device without a browser, use the
device authorization flow. Do not implement a password grant.

## Using the credential

- Send access tokens only as `Authorization: Bearer <token>`. `bearer_methods_supported` is `header`.
- Request `offline_access` only if you genuinely run unattended, and keep the refresh token in a secret store.
- Tokens are short-lived. Refresh; do not cache past `exp`.
- Revoke at the `revocation_endpoint` when the agent is decommissioned.
- Validate `iss`, `aud` and the signature against the JWKS on every request you accept.

## Staff surfaces

Internal WRLD tools are behind a separate access layer with no self-service
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

Passive discovery is welcome. Do not probe the registration or token
endpoints without intent to register, do not enumerate accounts, and do not
automate the human sign-in pages. Report a security concern through
<https://wrld.tech/contact>.
