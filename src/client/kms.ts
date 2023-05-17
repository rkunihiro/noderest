import { DecryptCommand, EncryptCommand, KMSClient } from "@aws-sdk/client-kms";

class KMS {
    private readonly client: KMSClient;

    private readonly keyId: string;

    constructor(keyId: string) {
        this.client = new KMSClient({
            endpoint: "http://localhost:4566",
        });
        this.keyId = keyId;
    }

    /**
     * Encrypt string
     * @param plaintext
     * @returns base64 encoded ciphertext
     */
    async encrypt(plaintext: string): Promise<string> {
        const command = new EncryptCommand({
            KeyId: this.keyId,
            Plaintext: Buffer.from(plaintext),
        });
        const { CiphertextBlob } = await this.client.send(command);
        return Buffer.from(CiphertextBlob ?? "").toString("base64");
    }

    /**
     * Decrypt base64 encoded ciphertext
     * @param ciphertext
     * @returns plaintext
     */
    async decrypt(ciphertext: string): Promise<string> {
        const command = new DecryptCommand({
            CiphertextBlob: Buffer.from(ciphertext, "base64"),
        });
        const { Plaintext } = await this.client.send(command);
        return Buffer.from(Plaintext ?? "").toString("utf8");
    }
}

export const kms = new KMS("alias/alias_name");
