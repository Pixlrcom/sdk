import { MessageIterator } from "../iterators/MessageIterator";
import { Message } from "../types";

export abstract class Application {
  protected constructor(protected port: MessagePort) {}

  /**
   * Open an image file
   * This function an async generator, so it will produce new images everytime the user saves the opened image
   * The iterator closes when the user closes the file in the editor
   * @param file The file to open, should be an image file
   */
  public async *open(file: File) {
    const buffer = await file.arrayBuffer();
    const port = this.sendMessage({ op: "open", buffer, name: file.name }, [
      buffer,
    ]);

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
