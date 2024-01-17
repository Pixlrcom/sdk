# Pixlr SDK

PixlrSDK is a library that allows you to integrate Pixlr's image editing capabilities directly into your web applications. It provides an easy-to-use API to open and edit images in an embedded Pixlr editor within an iframe.

## Features

- Open image files in an embedded Pixlr editor.
- Edit images using Pixlr's robust editing tools.
- Handle real-time updates when images are saved in the editor.
- Easy integration with modern web applications.

## Installation

Install Pixlr SDK via npm:

```bash
npm install pixlr-sdk
```

Or using yarn:

```bash
yarn add pixlr-sdk
```

## Usage

Here's a quick example to get you started:

```ts
import { Editor } from 'pixlr-sdk';

const frame = document.getElementById('your-iframe-id');
const fileInput = document.getElementById('your-file-input-id');

let editor;

fileInput.addEventListener('change', async (event) => {
    const files = event.target.files;
    if (files.length > 0) {
        const file = files[0]; // Use the first file for this example

        if(!editor) {
            // Connect to the Pixlr editor
            editor = await Editor.connect('your-jwt-token', frame, {
                baseUrl: "https://pixlr.com", // Optional: Custom base URL for the editor
            });
        }

        // Open the file in the editor
        for await (const newFile of editor.open(file)) {
            // Handle the updated file
            // For example, display the edited image on your page
        }
    }
});
```

In your HTML:

```html
<iframe id="your-iframe-id" src="/iframe/empty"></iframe>
<input type="file" id="your-file-input-id" />
```

## API Reference

### `Editor.connect(token: string, target: HTMLIFrameElement, options?: OpenOptions): Promise<Editor>`

Connects to an instance of the Pixlr editor.

- `token`: JWT token for API access.
- `target`: The iframe element to embed the editor in.
- `options`: Optional. Open settings (not editor settings).

### `Editor.open(file: File): AsyncGenerator<File>`

Opens an image file in the editor. Returns an async generator that yields updated files.

- `file`: The image file to open.

---

### Notes

1. **Customization**: Replace placeholders like `your-jwt-token`, `your-iframe-id`, `your-file-input-id`, and links (`LINK_TO_YOUR_CONTRIBUTING_GUIDE`, `LINK_TO_YOUR_LICENSE`) with actual values or paths relevant to your project.

2. **Additional Sections**: Depending on your project's complexity and community involvement, you might want to add sections like 'Support', 'Roadmap', or 'Acknowledgments'.

3. **Examples and Documentation**: If your library has more complex use cases or configurations, consider adding a link to a more detailed documentation site or wiki. For larger examples, you might also include a separate `examples` folder in your project repository and reference it in the README.

4. **Issue Reporting and Code of Conduct**: Encourage users to report issues via the issue tracker on your repository. It's also good practice to include a Code of Conduct to foster an inclusive and respectful community.

5. **Versioning and Updates**: If your library will undergo active development, mention how versioning will be handled, and how users can stay updated with new releases.

6. **Demo or Live Example**: If possible, provide a link to a live demo or a sandbox environment like CodeSandbox or JSFiddle. This allows users to see your library in action and try it out without any setup.

7. **Screenshots or Videos**: Visuals can be very helpful in showing users what to expect from your library. If your library has a UI component, consider adding screenshots or videos demonstrating its use.

8. **Support or Contact Information**: If you or your organization offers professional support, consultancy, or you just want to offer a way for users to reach out for help, include contact information or links to relevant resources.
