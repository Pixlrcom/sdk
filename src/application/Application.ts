import { MessageIterator } from "../iterators/MessageIterator";
import { Message } from "../types";
import { OpenOptions } from "../types";
import { timeout } from "../helpers/functions";

export abstract class Application {
  protected constructor(protected port: MessagePort) {}

  protected static async connectToIframe(
    path: string,
    token: string,
    target: HTMLIFrameElement,
    options: OpenOptions): Promise<MessagePort> {
    const baseUrl = new URL(options?.baseUrl ?? "https://pixlr.com");

    const ready = new Promise<MessagePort>((resolve, reject) => {
      const handler = (event: MessageEvent) => {
        if (event.origin !== baseUrl.origin) return;
        if (event.data?.op !== 'ready') return reject('unexpected message: ready not received');
        if (event.ports.length !== 1) return reject('ready did not send a port');

        resolve(event.ports[0]);

        window.removeEventListener('message', handler);
      };

      window.addEventListener('message', handler);
    });

    const url = new URL(baseUrl);
    url.pathname += path;
    url.searchParams.append("token", token);

    target.src = url.toString();

    // Wait for the site to post a message or fail after a minute (10 seconds)
    const port = await Promise.race([
      ready,
      timeout(10_000).then(() => {
        throw new Error("timeout");
      }),
    ]);

    return port;
  }

  /**
   * Open an image file
   * This function an async generator, so it will produce new images everytime the user saves the opened image
   * The iterator closes when the user closes the file in the editor
   * @param file The file to open, should be an image file
   */
  public async *open(file: File | URL) {
    let port: MessagePort;

    if (file instanceof File) {
      const buffer = await file.arrayBuffer();
      port = this.sendMessage({ op: "open", buffer, name: file.name }, [
        buffer,
      ]);
    } else {
      port = this.sendMessage({ op: "open-url", url: file.toString() }, []);
    }

    const iter = new MessageIterator(port);

    for await (const message of iter) {
      yield message.data as File;
    }
  }

  private sendMessage(msg: Message, transfer: Transferable[]): MessagePort {
    const { port1, port2 } = new MessageChannel();
    this.port.postMessage(msg, [port2, ...transfer]);
    return port1;
  }
}
