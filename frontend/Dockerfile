FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /src
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat 

# Install dependencies
COPY src/package* /src/

RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /src
COPY --from=deps /src/node_modules /src/node_modules
COPY src/ /src/
# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /src
COPY src/ /src/

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001


# Set the correct permission for prerender cache

COPY --from=builder /src/.next /src/.next

USER nextjs

EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME localhost

WORKDIR /src

# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["npm", "run", "start"]
