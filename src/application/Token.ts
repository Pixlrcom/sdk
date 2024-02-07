import { SignJWT } from "jose";
import { ApiAccessKeys, PixlrPayloadJWT } from "../types";

/**
 * A class to generate JWT tokens for Pixlr API access
 */
export class Token {
    private clientKey: string;
    private clientSecret: string;
  
    constructor({ clientKey, clientSecret }: ApiAccessKeys) {
      this.clientKey = clientKey;
      this.clientSecret = clientSecret;
    }
  
    async createToken(payload: PixlrPayloadJWT): Promise<string> {
      const secret = new TextEncoder().encode(this.clientSecret);
      const alg = "HS256";
  
      const jwt = await new SignJWT({ ...payload })
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setExpirationTime("1h")
        .setSubject(this.clientKey)
        .sign(secret);
  
      return jwt;
    }
  
    // Static factory method for optional instantiation
    static generate(config: ApiAccessKeys): Token {
      return new Token(config);
    }
  }
