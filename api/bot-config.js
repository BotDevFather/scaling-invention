
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      error: "POST required"
    });
  }

  const webhookUrl = process.env.TBL_BROADCAST_WEBHOOK_URL;

  if (!webhookUrl) {
    return res.status(500).json({
      ok: false,
      error: "Broadcast webhook is not configured"
    });
  }

  const { message } = req.body || {};

  if (typeof message !== "string" || !message.trim()) {
    return res.status(400).json({
      ok: false,
      error: "Message is required"
    });
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        params: {
          message: message.trim()
        }
      })
    });

    const result = await response.json().catch(() => null);

    if (!response.ok || !result || result.ok === false) {
      return res.status(response.status || 502).json({
        ok: false,
        error: result?.error || "Broadcast webhook failed"
      });
    }

    return res.status(200).json({
      ok: true,
      result
    });

  } catch (error) {
    return res.status(502).json({
      ok: false,
      error: "Could not reach bot webhook"
    });
  }
}
