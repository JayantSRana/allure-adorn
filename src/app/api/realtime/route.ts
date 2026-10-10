export const runtime = 'edge';

export async function GET() {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(encoder.encode(`event: ${event}\n`));
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };
      send('connected', { message: 'Allure Adorn SSE connected' });
      const interval = setInterval(() => {
        send('heartbeat', { timestamp: Date.now() });
      }, 30000);
      const ctrl = controller as ReadableStreamDefaultController<Uint8Array> & {
        cleanup?: () => void;
      };
      ctrl.cleanup = () => clearInterval(interval);
    },
    cancel() {
      // cleanup
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
