# Pixlr SDK

PixlrSDK is a library that allows you to integrate Pixlr's image editing capabilities directly into your web applications. It provides an easy-to-use API to open and edit images in an embedded Pixlr editor within an iframe.

## Obtaining Access Keys

To obtain API Access keys, you must first register an account at [Pixlr.com](https://pixlr.com). After creating your account, you can generate your API Access keys by visiting [this page](https://pixlr.com/myaccount) and navigating to the Developer section.

## Features

- Open image files in an embedded Pixlr editor.
- Edit images using Pixlr's robust editing tools.
- Handle real-time updates when images are saved in the editor.
- Easy integration with modern web applications.
- Tree-shakable and minimal bundle size.

## Installation

Install Pixlr SDK via npm:

```bash
npm install @pixlrlte/pixlr-sdk
```

Or using yarn:

```bash
yarn add @pixlrlte/pixlr-sdk
```

## Server side Usage

> Always generate the token server-side and never expose your API secret to the client.

## Token generation

To begin, ensure you have the necessary API access keys. You can generate them under [/myaccount](https://pixlr.com/myaccount)  > Developer.

- `clientKey`: Your API key.
- `clientSecret`: Your API secret, which should never be shared or exposed client-side.

These keys will be used to authenticate and generate a JWT (JSON Web Token) for secure API access.

### Token Class

This library offers a simple way to generate them using the class `Token` and it's static method `createToken`

```ts

import { Token, type PixlrPayloadJWT } from 'pixlr-sdk';

const tokenService = new Token({
    clientKey,
    clientSecret,
  });

  const token = await tokenService.createToken(payload);

// Or if you want to use factory pattern:
  const otherToken = await Token
                            .generate({ clientKey, clientSecret })
                            .createToken(payload);

```

### Token Payload

> The payload for the token generation depends on the API mode you are operating in, which can be either `http` or `embedded`.

#### Common Payload Properties

- `mode`: Specifies the API mode you are operating in (`http` or `embedded`). This property is required.
- `settings`: An optional object that allows you to apply specific settings to Pixlr Applications. These settings can alter the behavior and theme of the applications without changing the API's behavior.

#### Embedded Mode Payload

In `embedded` mode, the payload requires the following properties:

- `mode`: "embedded"
- `origin`: The base domain of your application (e.g., `https://yourdomain.com`). This is crucial for ensuring that Pixlr Applications respond only to requests originating from the specified domain.

Example:

```ts
const payload: PixlrPayloadJWT = {
  mode: 'embedded',
  origin: 'https://yourdomain.com',
  settings: {
    // Optional settings
  }
};
```

### HTTP Mode Payload

In http mode, the payload includes these additional properties:

- `openUrl`: URL where the Pixlr Application will fetch and open an image on startup. Required in http mode.

- `saveUrl`: URL where the Pixlr Applications will send a HTTP POST with the saved image. Required in http mode.

- `follow`: Optional. If enabled (defaults to true), the application window will navigate to the saveUrl location using a standard FORM post. If disabled, it will POST using XHR, leaving the application window intact.

Example:

```ts

const payload: PixlrPayloadJWT = {
  mode: 'http',
  openUrl: '<https://example.com/open>',
  saveUrl: '<https://example.com/save>',
  follow: false, // Optional, defaults to true
  settings: {
    // Optional settings
  }
};

```

### Settings

The settings object in the payload allows for fine-tuning the Pixlr Applications' behavior and appearance. Available settings include:

- `referrer`: Name of the application using the API, displayed in the Pixlr Applications.

- `icon`: URL to an icon for your application, shown in the Pixlr Applications.

- `accent`: Accent color for the application.

- `workspace`: Workspace (background) color for the application.

- `tabLimit`: Maximum number of tabs a user can have open at once.

- `blockOpen`: If true, Pixlr Application will block users from opening images from sources other than the API.

Example

```ts

settings: {
  referrer: 'My Awesome App',
  icon: 'https://example.com/icon.png',
  accent: '#FF5733',
  workspace: '#EEEEEE',
  tabLimit: 5,
  blockOpen: true
}
```

## Frontend Usage

### `Editor.connect(token: string, target: HTMLIFrameElement, options?: OpenOptions): Promise<Editor>`

Connects to an instance of the Pixlr editor.

- `token`: JWT token for API access.
- `target`: The iframe element to embed the editor in.
- `options`: Optional. Open settings (not editor settings).
  - `baseUrl`: Optional url for the editor. Defaults to `https://pixlr.com`.
  - `fullEditor`: Optional. By default a [Pixlr Express](https://pixlr.com/express/) version will be used, set this key to true to experiment the full power of [Pixlr Editor](https://pixlr.com/editor/).
  - `language`: Optional. By default Editor will be in English. Set this key to the preferred language

### `Editor.open(file: File | URL): AsyncGenerator<File>`

Opens an image file or url in the editor. Returns an async generator that yields updated files.

- `file`: The image file to open.

### Example

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
                langueage: "jp", // Optional: Language for application
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
