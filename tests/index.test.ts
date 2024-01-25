import { Editor } from "../src";


describe('Editor', () => {
    let iframe: HTMLIFrameElement;
    

    beforeEach(() => {
        iframe = document.createElement('iframe');
        document.body.appendChild(iframe);
    });

    afterEach(() => {
        document.body.removeChild(iframe);
    });

    it('Editor should be defined', async () => {
        expect(Editor).toBeDefined();
        expect(Editor.connect).toBeDefined();
    });

});
