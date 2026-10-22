export class RequestError extends Error {
  status: number
  constructor(status: number, message: string) { super(message); this.status = status }
}

/** Enforce actual streamed bytes, including when Content-Length is absent or false. */
export async function readJson(req: Request, maxBytes: number): Promise<unknown> {
  if (!req.headers.get("content-type")?.toLowerCase().startsWith("application/json")) throw new RequestError(400, "Expected JSON")
  if (Number(req.headers.get("content-length")) > maxBytes) throw new RequestError(413, "Request body is too large")
  const reader = req.body?.getReader()
  if (!reader) throw new RequestError(400, "Missing request body")
  const chunks: Uint8Array[] = []
  let size = 0
  try {
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > maxBytes) { await reader.cancel(); throw new RequestError(413, "Request body is too large") }
      chunks.push(value)
    }
    const bytes = new Uint8Array(size)
    let offset = 0
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength }
    return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes))
  } catch (error) {
    if (error instanceof RequestError) throw error
    throw new RequestError(400, "Malformed JSON")
  } finally { reader.releaseLock() }
}
