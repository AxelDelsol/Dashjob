export default function ErrorText({
  id,
  error_messages,
}: {
  id: string;
  error_messages?: string[] | string | null;
}) {
  if (!error_messages) {
    return;
  }

  const messages: string[] =
    typeof error_messages == "string" ? [error_messages] : error_messages;

  return (
    <div id={id} aria-live="polite" aria-atomic="true">
      {messages.map((error: string) => (
        <p className="mt-1 text-sm text-red-500" key={error}>
          {error}
        </p>
      ))}
    </div>
  );
}
