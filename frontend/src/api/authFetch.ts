const BASE_URL = "http://localhost:3001";

let refreshPromise: Promise<boolean> | null = null;

const refreshAccessToken = async (): Promise<boolean> => {

    if (!refreshPromise) {

        refreshPromise = (async () => {

            try {

                const response = await fetch(
                    `${BASE_URL}/refresh-token`,
                    {
                        method: "POST",
                        credentials: "include",
                    }
                );

                return response.ok;

            } catch {

                return false;

            } finally {

                refreshPromise = null;

            }

        })();

    }

    return refreshPromise;
};

export const authFetch = async (
    endpoint: string,
    options: RequestInit = {}
): Promise<Response> => {

    const url = endpoint.startsWith("http")
    ? endpoint
    : `${BASE_URL}${endpoint}`;

    // First Request
    let response = await fetch(
        url,
        {
            credentials: "include",
            ...options,
        }
    );

    // Access Token still valid
    if (response.status !== 401) {
        return response;
    }

    // Try Refresh Token
    const refreshed = await refreshAccessToken();

    // Refresh failed
    if (!refreshed) {
        return response;
    }

    // Retry original request once
    response = await fetch(
        url,
        {
            credentials: "include",
            ...options,
        }
    );

    return response;
};