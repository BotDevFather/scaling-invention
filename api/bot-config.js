
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      error: "POST required"
    });
  }

  const webhookUrl = "https://webapp.telebothost.com/ownlang/webhook/120462008075532?command=updateConfig&sig=6ef779c506185e3c002e67fa83b556a17bb83786b16a5d1b5a922a0faa2b9b24&gl=1";

  if (!webhookUrl) {
    return res.status(500).json({
      ok: false,
      error: "Webhook URL not configured"
    });
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        params: req.body
      })
    });

    const result = await response.json();

    return res.status(response.status).json(result);
  } catch (error) {
    return res.status(502).json({
      ok: false,
      error: "Could not reach bot webhook"
    });
  }
}
