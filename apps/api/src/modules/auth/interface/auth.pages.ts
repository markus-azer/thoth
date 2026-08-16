// Bare auth page stubs until the real frontend lands.

const STYLE = `<style>
	:root { color-scheme: dark }

	body { margin:0; min-height:100vh; display:grid; place-items:center;
		background:#0a0a0a; color:#ededed;
		font:16px/1.5 ui-sans-serif,system-ui,sans-serif }

	.card { width:min(360px,90vw); padding:2rem; text-align:center;
		background:#111; border:1px solid #262626; border-radius:12px }

	h1 { margin:0 0 .25rem; font-size:1.75rem; letter-spacing:.15em }
	p { margin:0 0 1.5rem; color:#a3a3a3; font-size:.9rem }

	button { width:100%; padding:.75rem 1rem; font-size:1rem; cursor:pointer;
		color:#0a0a0a; background:#ededed; border:0; border-radius:8px }
	button:hover { background:#fff }

	.error { display:none; margin:0 0 1.25rem; padding:.6rem .75rem; font-size:.85rem;
		background:#1f0d0d; border:1px solid #7f1d1d; border-radius:8px; color:#fca5a5 }
</style>`;

export const SIGN_IN_PAGE = `<!doctype html><meta charset="utf8"><title>Sign in · thoth</title>${STYLE}

<div class="card">
	<h1>THOTH</h1>
	<p>Sign in to continue</p>
	<div class="error" id="error"></div>
	<button onclick="signIn()">Continue with GitHub</button>
</div>

<script>
const params = new URLSearchParams(location.search);
const err = params.get("error");

if (err) {
	// textContent, not innerHTML: a reflected ?error= can't inject markup.
	const el = document.getElementById("error");
	el.textContent = err.replace(/_/g, " ");
	el.style.display = "block";
}

async function signIn() {
	// Resume the pending authorize after login, else it lands on "/" with no code.
	const callbackURL = location.search
		? "/api/auth/oauth2/authorize" + location.search
		: "/";

	const res = await fetch("/api/auth/sign-in/social", {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({ provider: "github", callbackURL, errorCallbackURL: "/auth/sign-in" }),
	});

	const { url } = await res.json();
	if (url) location.href = url;
}
</script>`;

export const CONSENT_PAGE = `<!doctype html><meta charset="utf8"><title>Authorize · thoth</title>${STYLE}

<div class="card">
	<h1>THOTH</h1>
	<p>Authorize this client to access your memory</p>
	<div class="error" id="error"></div>
	<button onclick="consent()">Authorize</button>
</div>

<script>
async function consent() {
	const res = await fetch("/api/auth/oauth2/consent", {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({ accept: true, oauth_query: location.search.slice(1) }),
	});

	// redirect_uri carries the code back to the client. Absent means no pending request.
	const { redirect_uri } = await res.json();
	if (redirect_uri) {
		location.href = redirect_uri;
		return;
	}

	const el = document.getElementById("error");
	el.textContent = "No sign-in in progress. Start from your client.";
	el.style.display = "block";
}
</script>`;
