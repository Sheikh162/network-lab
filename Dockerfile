# ---- Build stage ----
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy all source and build Next.js app
COPY . .
RUN npm run build

# ---- Run stage ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install qemu-img
RUN apk add --no-cache qemu-img

# Create non-root user first
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Create necessary directories and set ownership
# The app will need to write to these folders
RUN mkdir -p /app/data /app/overlays
RUN chown -R nextjs:nodejs /app/data /app/overlays

# Copy application files and set ownership
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to the non-root user
USER nextjs

EXPOSE 3000
ENV PORT 3000

# Run Next.js
CMD ["node", "server.js"]