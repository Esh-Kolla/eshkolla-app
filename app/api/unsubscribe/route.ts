import { unsubscribeByEmail } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return new Response(
      buildHtmlPage("Missing email", "No email address was provided."),
      { status: 400, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }

  const unsubscribed = unsubscribeByEmail(email.trim().toLowerCase());

  if (unsubscribed) {
    return new Response(
      buildHtmlPage(
        "Unsubscribed",
        `<strong>${escapeHtml(email)}</strong> has been removed from the AI/ML Journal newsletter. You will no longer receive emails.`
      ),
      { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }

  return new Response(
    buildHtmlPage(
      "Not found",
      "This email address was not found in our subscriber list, or was already unsubscribed."
    ),
    { status: 404, headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildHtmlPage(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title} - eshwarkolla.com</title>
  <style>
    body {
      background: #0a0a0a;
      color: #e0e0e0;
      font-family: 'Courier New', Courier, monospace;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      padding: 1rem;
    }
    .container {
      max-width: 480px;
      text-align: center;
      border: 1px solid #22c55e;
      padding: 2rem;
      border-radius: 4px;
    }
    h1 {
      color: #22c55e;
      font-size: 1.5rem;
      margin-top: 0;
    }
    p {
      line-height: 1.6;
    }
    a {
      color: #22c55e;
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>${title}</h1>
    <p>${body}</p>
    <p><a href="https://eshwarkolla.com">Back to eshwarkolla.com</a></p>
  </div>
</body>
</html>`;
}
