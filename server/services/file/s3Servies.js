import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const s3UploadPresignedUrl = async (fullFileName, type) => {
  const command = new PutObjectCommand({
    Bucket: "synkdrive",
    Key: fullFileName,
    ContentType: type,
  });

  const url = await getSignedUrl(s3Client, command, {
    expiresIn: 300,
    signableHeaders: new Set(["content-type"]),
  });

  return url;
};

export const s3GetPreSignedUrl = async ({ key, fileName }) => {
  const command = new GetObjectCommand({
    Bucket: "synkdrive",
    Key: key,
    ContentType: "application/zip",
    ResponseContentDisposition: `"attachment"; filename=${encodeURIComponent(fileName)}`,
  });
  const getUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 3600,
  });
  return getUrl;
};

export const s3GetObjectsInfo = async ({ key }) => {
  const command = new HeadObjectCommand({
    Bucket: "synkdrive",
    Key: key,
  });
  return await s3Client.send(command);
};

export const s3DeletePreSingedUrl = async ({ key }) => {
  const command = new DeleteObjectCommand({
    Bucket: "synkdrive",
    Key: key,
  });
  return await s3Client.send(command);
};

export const s3DeleteObjects = async ({ Keys }) => {
  const command = new DeleteObjectsCommand({
    Bucket: "synkdrive",
    Delete: {
      Objects: Keys,
      Quiet: false,
    },
  });
  return await s3Client.send(command);
};
