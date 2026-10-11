import { bus } from '@/lib/realtime';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const encoder = new TextEncoder();
  let cleanup: () => void = () => {};

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const send = (event: string, data: unknown) => {
        try {
          controller.enqueue(encoder.encode(`event: ${event}\n`));
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        } catch {
          // stream closed — ignore
        }
      };

      send('connected', { message: 'Allure Adorn live feed connected' });

      const onEvent = (envelope: { event: string; data: unknown }) => {
        send(envelope.event, envelope.data);
      };
      bus.on('event', onEvent);

      const heartbeat = setInterval(() => send('heartbeat', { t: Date.now() }), 25000);

      cleanup = () => {
        clearInterval(heartbeat);
        bus.off('event', onEvent);
      };
    },
    cancel() {
      cleanup();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
