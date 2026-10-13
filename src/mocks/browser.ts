import type { UnhandledFrameHandle } from "msw"
import { setupWorker } from "msw/browser"
import { apiBaseUrl } from "@/shared/api/client"
import { handlers } from "./handlers"

export const worker = setupWorker(...handlers)
export const onUnhandledFrame: UnhandledFrameHandle = ({ frame, defaults }) => {
  const { data } = frame
  if (
    data instanceof Object &&
    "request" in data &&
    data.request instanceof Request &&
    data.request.url.startsWith(apiBaseUrl)
  )
    defaults.error()
}
