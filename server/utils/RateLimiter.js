import rateLimit from "express-rate-limit";
import crypto    from "crypto";


const _1s  = 1000;
export const _1m  = 60  * _1s;
const _5m  = 5   * _1m;
const _15m = 15  * _1m;
const _10m  = 10 * _1m; 
const _30m = 30  * _1m;
const _1h  = 60  * _1m;
const _6h  = 6   * _1h;
const _12h = 12  * _1h;
const _1d  = 24  * _1h;


const SALT = process.env.RATE_LIMIT_SALT ?? "default_insecure_salt";

const hmac = (value) =>
  crypto
    .createHmac("sha256", SALT)
    .update(value)
    .digest("hex");


const normalizeIp = (ip = "") =>

  ip.startsWith("::ffff:") ? ip.slice(7) : ip;

const getIp = (req) =>
  normalizeIp(req.ip ?? req.socket?.remoteAddress ?? "unknown");


export const keyGenerators = {
  ip: (req) =>
    `ip:${hmac(getIp(req))}`,

 
  user: (req) =>
    req.user?._id
      ? `user:${req.user._id.toString()}`
      : `ip:${hmac(getIp(req))}`,

};


export const RateLimiter = ({
  windowTimeInMs = _15m,
  limit          = 250,
  message        = "Too many requests. Please try again later.",
  keyGenerator   = keyGenerators.ip,  
  skipSuccess    = false,
  skipFailed     = false,
} = {}) =>
  rateLimit({
    windowMs              : windowTimeInMs,
    limit,
    keyGenerator,
    skipSuccessfulRequests: skipSuccess,
    skipFailedRequests    : skipFailed,
    standardHeaders       : "draft-7",
    legacyHeaders         : false,
     handler: (req, res, next, options) =>
      res.status(options.statusCode).json({
        success  : false,
        error    : message,
        limit    : req.rateLimit?.limit,
        remaining: req.rateLimit?.remaining,
        resetAt  : req.rateLimit?.resetTime
          ? new Date(req.rateLimit.resetTime).toISOString()
          : null,
      }),
  });


const makeLimiter = (limit, windowMs, options = {}) =>
  () => RateLimiter({ limit, windowTimeInMs: windowMs, ...options });


const rateLimiterConfig = {

  login              : [ 5,   _15m, { message: "Too many login attempts. Try again in 15 minutes.",         keyGenerator: keyGenerators.ip,   skipSuccess: true  }],
  register           : [ 3,   _1h,  { message: "Too many register attempts. Try again in 1 hour.",          keyGenerator: keyGenerators.ip,   skipSuccess: true  }],
  socialLogin        : [ 10,  _15m, { message: "Too many social login attempts. Try again in 15 minutes.",  keyGenerator: keyGenerators.ip,   skipSuccess: true  }],
  otp                : [ 3,   _5m,  { message: "Too many OTP requests. Try again in 5 minutes.",            keyGenerator: keyGenerators.ip,   skipSuccess: true  }],
  passwordReset      : [ 3,   _1h,  { message: "Too many reset attempts. Try again in 1 hour.",             keyGenerator: keyGenerators.ip,   skipSuccess: true  }],
  setPassword        : [ 5,   _15m, { message: "Too many password set attempts.",                           keyGenerator: keyGenerators.user, skipSuccess: true  }],
  updatePassword     : [ 5,   _15m, { message: "Too many password update attempts.",                        keyGenerator: keyGenerators.user, skipSuccess: true  }],
  updateProfile      : [ 20,  _1m,  { message: "Too many profile update requests.",                         keyGenerator: keyGenerators.user                     }],
  getProfile         : [ 60,  _1m,  { message: "Too many profile fetch requests.",                          keyGenerator: keyGenerators.user                     }],
  logout             : [ 10,  _15m, { message: "Too many logout attempts.",                                 keyGenerator: keyGenerators.user                     }],
  logoutAllDevices   : [ 5,   _15m, { message: "Too many logout-all attempts.",                             keyGenerator: keyGenerators.user                     }],
  deleteSession      : [ 10,  _15m, { message: "Too many session delete attempts.",                         keyGenerator: keyGenerators.user                     }],
  disableAccount     : [ 3,   _1h,  { message: "Too many disable account attempts.",                        keyGenerator: keyGenerators.user, skipSuccess: true  }],
  deleteAccount      : [ 3,   _1h,  { message: "Too many account delete attempts.",                         keyGenerator: keyGenerators.user, skipSuccess: true  }],
  fileUpload         : [ 15,  _15m,  { message: "Upload limit reached. Try again in 1 hour.",                keyGenerator: keyGenerators.user                     }],
  fileDownload       : [ 50,  _1h,  { message: "Download limit reached. Try again in 1 hour.",              keyGenerator: keyGenerators.user                     }],
  fileStream         : [ 30,  _1m,  { message: "Stream request limit exceeded.",                            keyGenerator: keyGenerators.user                     }],
  fileGet            : [ 100, _1m,  { message: "File fetch limit exceeded.",                                keyGenerator: keyGenerators.user                     }],
  fileRename         : [ 20,  _1m,  { message: "File rename limit exceeded.",                               keyGenerator: keyGenerators.user                     }],
  fileDelete         : [ 20,  _1m,  { message: "File delete limit exceeded.",                               keyGenerator: keyGenerators.user                     }],
  BulkDelete     : [10,  _1m,  { message: "Bulk delete limit exceeded.",                               keyGenerator: keyGenerators.user                     }],
  filePermanentDelete: [10,  _1m,  { message: "Permanent delete limit exceeded.",                          keyGenerator: keyGenerators.user                     }],
  fileShareLink      : [20,  _1m,  { message: "Share link request limit exceeded.",                        keyGenerator: keyGenerators.user                     }],
  fileShareToggle    : [10,  _1m,  { message: "Share toggle limit exceeded.",                              keyGenerator: keyGenerators.user                     }],
  fileSharePermission: [10,  _1m,  { message: "Permission update limit exceeded.",                         keyGenerator: keyGenerators.user                     }],
  fileShareEmail     : [ 5,   _15m, { message: "Email share limit exceeded. Try again in 15 minutes.",      keyGenerator: keyGenerators.user                     }],
  fileEmailInvite    : [5,   _15m, { message: "Email invite limit exceeded. Try again in 15 minutes.",     keyGenerator: keyGenerators.user                     }],
  filePublicAccess   : [ 100, _1m,  { message: "Public file access limit exceeded.",                        keyGenerator: keyGenerators.ip                       }],
  fileShareAccess    : [ 50,  _1m,  { message: "Shared file access limit exceeded.",                        keyGenerator: keyGenerators.ip                       }],
  folderCreate       : [ 20,  _1m,  { message: "Folder create limit exceeded.",                             keyGenerator: keyGenerators.user                     }],
  folderGet          : [ 100, _1m,  { message: "Folder fetch limit exceeded.",                              keyGenerator: keyGenerators.user                     }],
  folderRename       : [ 20,  _1m,  { message: "Folder rename limit exceeded.",                             keyGenerator: keyGenerators.user                     }],
  folderDelete       : [ 20,  _1m,  { message: "Folder delete limit exceeded.",                             keyGenerator: keyGenerators.user                     }],
  folderBulkDelete   : [ 10,  _1m,  { message: "Folder bulk delete limit exceeded.",                        keyGenerator: keyGenerators.user                     }],
  driveImport        : [ 5,   _1h,  { message: "Google Drive import limit reached. Try again in 1 hour.",   keyGenerator: keyGenerators.user                     }],
  recycleGet         : [ 30,  _1m,  { message: "Recycle bin fetch limit exceeded.",                         keyGenerator: keyGenerators.user                     }],
  restoreSingle      : [ 20,  _1m,  { message: "Restore limit exceeded.",                                   keyGenerator: keyGenerators.user                     }],
  restoreBulk        : [ 10,  _1m,  { message: "Bulk restore limit exceeded.",                              keyGenerator: keyGenerators.user                     }],
  subscriptionCreate : [ 5,   _15m,  { message: "Subscription create limit reached.",                        keyGenerator: keyGenerators.user, skipSuccess: true  }],
  subscriptionStatus : [ 30,  _1m,  { message: "Subscription status fetch limit exceeded.",                 keyGenerator: keyGenerators.user                     }],
  subscriptionPause  : [ 5,   _10m,  { message: "Subscription pause limit reached.",                         keyGenerator: keyGenerators.user                     }],
  subscriptionResume : [ 5,   _10m,  { message: "Subscription resume limit reached.",                        keyGenerator: keyGenerators.user                     }],

};

export const Limiter = Object.fromEntries(
  Object.entries(rateLimiterConfig).map(([key, [limit, windowMs, options]]) => [
    key,
    makeLimiter(limit, windowMs, options),
  ])
);