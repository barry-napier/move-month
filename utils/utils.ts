import { redirect } from "next/navigation";

type MessageType = "error" | "success";

export function encodedRedirect(
  type: MessageType,
  path: string,
  message: string
) {
  const params = new URLSearchParams();
  params.set(type, message);
  return redirect(`${path}?${params.toString()}`);
}
