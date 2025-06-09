// utils/fetchData.ts

let cache: Record<string, any> = {};
const KeyToken = process.env.NEXT_PUBLIC_DXCLOUD_KEY!;

const newAbortSignal = (timeoutMs: number): AbortSignal => {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeoutMs);
  return controller.signal;
};

export async function dxFetchData(
  key: string,
  endpoint: string,
  updateOptions: (data: any) => void
): Promise<void> {
  if (cache[key]) {
    updateOptions(cache[key]);
    return;
  }

  const signal = newAbortSignal(5000);

  try {
    const response = await fetch(endpoint, {
      signal,
      headers: {
        Authorization: `Bearer ${KeyToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();

    // Try to extract usable data
    const result = data?.status && data?.data ? data.data : data;

    // Optional: check if result is array or object
    if (result !== undefined) {
      cache[key] = result;
      updateOptions(result);
    } else {
      console.warn("API returned unexpected data format:", data);
    }

  } catch (error: any) {
    if (error.name === "AbortError") {
      console.log("Request canceled:", error.message);
    } else {
      console.error("Error fetching data:", error);
    }
  }
}
