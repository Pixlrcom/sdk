import { Application } from "../application/Application";
import { timeout } from "../helpers/functions";
import { OpenOptions } from "../types";

/**
 * A proxy class to control an embeded Editor
 */
export class Editor extends Application {
  /**
   * Open and connect to an instance of Pixlr editor in the target iframe
   * @param token JWT token to use for API access
   * @param target The iframe to open the editor in
   * @param options Open settings, NOT editor settings
   * @returns An instance of this class that can talk to the embeded editor
   */
  public static async connect(
    token: string,
    target: HTMLIFrameElement,
    options: OpenOptions = {}
  ): Promise<Editor> {
    const baseUrl = options?.baseUrl ?? "https://pixlr.com";
    const pathname = options?.fullEditor ? "editor/" : "express/";

    const ready = new Promise<MessagePort>((resolve, reject) => {
      const handler = (event: MessageEvent) => {
        if (event.origin !== baseUrl) return;
        if (event.data?.op !== 'ready') return reject('unexpected message: ready not received');
        if (event.ports.length !== 1) return reject('ready did not send a port');

        resolve(event.ports[0]);

        window.removeEventListener('message', handler);
      };

      window.addEventListener('message', handler);
    });

    const url = new URL(baseUrl);
    url.pathname =pathname;
    url.searchParams.append("token", token);

    target.src = url.toString();

    // Wait for the site to post a message or fail after a minute (10 seconds)
    const port = await Promise.race([
      ready,
      timeout(10_000).then(() => {
        throw new Error("timeout");
      }),
    ]);

    return new Editor(port);
  }
}
