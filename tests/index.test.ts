import { Editor } from "../src";


describe('Editor', () => {
    let iframe: HTMLIFrameElement;
    let editor: Editor;

    beforeEach(() => {
        iframe = document.createElement('iframe');
        document.body.appendChild(iframe);
    });

    afterEach(() => {
        document.body.removeChild(iframe);
    });

    it('should connect to the editor', async () => {
        const token = 'test-token';
        const mockPort: MessagePort = new MessageChannel().port1;
        const mockMessageEvent = new MessageEvent('message', {
            data: { op: 'connected' }
        });

        jest.spyOn(window, 'MessageChannel').mockImplementation(() => {
            return {
                port1: mockPort,
                port2: mockPort
            };
        });

        setTimeout(() => mockPort.dispatchEvent(mockMessageEvent), 100);

        editor = await Editor.connect(token, iframe);

        expect(editor).toBeInstanceOf(Editor);
        
    });

});
