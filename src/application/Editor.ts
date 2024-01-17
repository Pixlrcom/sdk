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

    const ready = new Promise<MessagePort>((resolve, reject) => {
      target.addEventListener(
        "load",
        () => {
          const { port1, port2 } = new MessageChannel();

          port1.onmessage = (event: MessageEvent) => {
            if (event.data?.op === "connected") resolve(port1);
            else reject(new Error("Unexpectcd init message from Applicaton"));

            port1.onmessage = null;
          };

          target.contentWindow?.postMessage({ op: "connect" }, baseUrl, [
            port2,
          ]);
        },
        { once: true }
      );
    });

    const url = new URL(baseUrl);
    url.pathname = "editor/";
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
