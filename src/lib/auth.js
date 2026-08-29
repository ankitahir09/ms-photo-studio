import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.BETTER_AUTH_SECRET || "fallback_secret_change_me_in_prod";

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Utility to match the exact API of the old better-auth getSession call so we don't need to rewrite as much
export const auth = {
  api: {
    getSession: async ({ headers }) => {
      // In Next.js App Router API routes, we can parse cookies from headers or just expect the caller to pass them
      const cookieHeader = headers.get("cookie");
      if (!cookieHeader) return null;

      const cookies = Object.fromEntries(
        cookieHeader.split("; ").map((c) => {
          const [key, ...v] = c.split("=");
          return [key, decodeURIComponent(v.join("="))];
        })
      );

      const token = cookies["auth_token"];
      if (!token) return null;

      const decoded = verifyToken(token);
      if (!decoded) return null;

      return { user: { id: decoded.id, username: decoded.username } };
    },
  },
};
