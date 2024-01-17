import { JWTPayload, SignJWT } from "jose";

type Credentials = { clientKey: string; clientSecret: string };

/**
 * Class representing a Token generator for creating JWT tokens.
 * 
 * IMPORTANT: This class should be used server-side only to avoid exposing sensitive credentials.
 *
 * @example
 * ```typescript
 * // Example of using the Token class
 * const tokenInstance = new Token({ clientKey: 'yourClientKey', clientSecret: 'yourClientSecret' });
 * 
 *  // Example of creating a generic payload
 * const payload = {
 *   mode: 'http',
 *   follow: true,
 *   openUrl: `${url.origin}/upload/${image.name}`,
 *   saveUrl: `${url.origin}/http?/save`
 * };
 * const token = await tokenInstance.create(payload);
 * ```
 */
export class Token {
  /**
   * Creates an instance of Token.
   * @param {Credentials} credentials - The credentials including clientKey and clientSecret.
   */
  constructor(public credentials: Credentials) {}

  /**
   * Create a JWT token for API calls.
   * @param {JWTPayload} payload - The payload for the JWT, containing API settings and data.
   * @returns {Promise<string>} A promise that resolves with the generated JWT token.
   */
  public async create(payload: JWTPayload): Promise<string> {
    const client = this.credentials.clientKey;
    const secret = new TextEncoder().encode(this.credentials.clientSecret);
    const alg = "HS256";

    const jwt = await new SignJWT({ ...payload })
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setExpirationTime("1h")
      .setSubject(client)
      .sign(secret);

    return jwt;
  }
}
