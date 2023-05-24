import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const endpoint = process.env["AWS_ENDPOINT"] ?? "http://localhost:4566";
const region = "ap-northeast-1";

class S3 {
    private readonly client: S3Client;

    constructor() {
        this.client = new S3Client({
            endpoint,
            region,
            forcePathStyle: true,
        });
    }

    /**
     * Put object to S3
     *
     * @param bucket backet name
     * @param key object key name
     * @param body body string
     */
    async put(bucket: string, key: string, body: string): Promise<void> {
        const command = new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: body,
        });
        await this.client.send(command);
    }

    /**
     * Get object from S3
     *
     * @param bucket backet name
     * @param key object key name
     * @returns body string
     */
    async get(bucket: string, key: string): Promise<string | undefined> {
        const command = new GetObjectCommand({
            Bucket: bucket,
            Key: key,
        });
        const output = await this.client.send(command);
        return output.Body?.transformToString();
    }
}

export const s3 = new S3();
