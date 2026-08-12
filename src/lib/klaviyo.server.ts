const KLAVIYO_REVISION = "2024-10-15";

function key() {
  return process.env.KLAVIYO_PRIVATE_API_KEY;
}

/**
 * Subscribe a profile to the nurture list so Klaviyo email flows are allowed
 * to send. Events alone create "Never Subscribed" profiles, which Klaviyo
 * skips in marketing flows.
 */
export async function subscribeToNurture(
  email: string,
  firstName?: string | null,
  extraProps?: Record<string, unknown>,
): Promise<void> {
  const apiKey = key();
  const listId = process.env.KLAVIYO_LIST_ID;
  if (!apiKey || !listId || !email) return;

  const properties: Record<string, unknown> = { ...(extraProps ?? {}) };
  if (firstName) properties.first_name = firstName;

  const body = {
    data: {
      type: "profile-subscription-bulk-create-job",
      attributes: {
        profiles: {
          data: [
            {
              type: "profile",
              attributes: {
                email: email.toLowerCase(),
                ...(firstName ? { first_name: firstName } : {}),
                ...(Object.keys(properties).length ? { properties } : {}),
                subscriptions: {
                  email: { marketing: { consent: "SUBSCRIBED" } },
                },
              },
            },
          ],
        },
      },
      relationships: { list: { data: { type: "list", id: listId } } },
    },
  };

  try {
    const res = await fetch(
      "https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/",
      {
        method: "POST",
        headers: {
          Authorization: `Klaviyo-API-Key ${apiKey}`,
          "Content-Type": "application/json",
          accept: "application/json",
          revision: KLAVIYO_REVISION,
        },
        body: JSON.stringify(body),
      },
    );
    if (!res.ok && res.status !== 202) {
      console.warn("Klaviyo subscribe failed", res.status, await res.text());
    }
  } catch (err) {
    console.warn(
      "Klaviyo subscribe error",
      err instanceof Error ? err.message : String(err),
    );
  }
}
