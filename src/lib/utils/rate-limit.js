const rateLimitMap = new Map();

export function rateLimit(request, limit = 100, windowMs = 60 * 1000) {
  const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
  
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: Date.now() + windowMs,
    });
    return true; // allowed
  }

  const tokenData = rateLimitMap.get(ip);
  if (Date.now() > tokenData.resetTime) {
    tokenData.count = 1;
    tokenData.resetTime = Date.now() + windowMs;
    return true; // allowed
  }

  if (tokenData.count < limit) {
    tokenData.count++;
    return true; // allowed
  }

  return false; // rate limited
}
