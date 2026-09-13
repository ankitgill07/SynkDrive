import { getSignedUrl } from "@aws-sdk/cloudfront-signer";

export const cloudfrontSignedUrl = async ({ key, fileName }) => {
  if (!process.env.CLOUDFRONT_PRIVATE_KEY) {
    throw new Error("CLOUDFRONT_PRIVATE_KEY is not configured");
  }

  const cloudfrontDistributionDomain = "https://d1tworb3sym6yh.cloudfront.net";
  const contentDisposition = encodeURIComponent(`inline; filename="${fileName}"`);
  const url = `${cloudfrontDistributionDomain}/${key}?response-content-disposition=${contentDisposition}`;

  const privateKey = Buffer.from(
    process.env.CLOUDFRONT_PRIVATE_KEY,
    "base64",
  ).toString("utf8");
  const keyPairId = "K2Z1983GBH6CH7";
  const dateLessThan = new Date(Date.now() + 60 * 60 * 1000).toISOString();

  const signedUrl = getSignedUrl({
    url,       
    keyPairId,
    dateLessThan,
    privateKey,
  });

  return signedUrl;
};
