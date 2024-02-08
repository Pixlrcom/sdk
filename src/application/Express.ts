import { Application } from "../application/Application";
import { OpenOptions } from "../types";

/**
 * A proxy class to control an embeded Editor
 */
export class Express extends Application {
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
  ): Promise<Express> {
    const port = await Application.connectToIframe('express/', token, target, options);
    return new Express(port);
  }
}
