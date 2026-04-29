import { getSignedUrl } from "@aws-sdk/cloudfront-signer";
import { readFile } from "fs/promises";

export const cloudfrontSignedUrl = async ({ key, fileName }) => {
  const cloudfrontDistributionDomain = "https://d1tworb3sym6yh.cloudfront.net";
  const contentDisposition = encodeURIComponent(`inline; filename="${fileName}"`);
  const url = `${cloudfrontDistributionDomain}/${key}?response-content-disposition=${contentDisposition}`;
const decodeValue =  atob(process.env.CLOUDFRONT_PRIVATE_KEY)

  const privateKey = decodeValue;
  const keyPairId = "K2Z1983GBH6CH7";
  const dateLessThan = "2026-09-09";

  const signedUrl = getSignedUrl({
    url,       
    keyPairId,
    dateLessThan,
    privateKey,
  });

  return signedUrl;
};
