##### DEPENDENCIES

FROM node:20-alpine AS deps

WORKDIR /app

# Fix Prisma errors

RUN apk add --no-cache libc6-compat openssl

# Install Prisma Client - remove if not using Prisma

COPY prisma ./prisma/

# Install dependencies based on the preferred package manager

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml\* ./

RUN printenv

RUN \
    if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm i; \
    else echo "Lockfile not found." && exit 1; \
    fi

##### BUILDER

FROM node:20-alpine AS builder
ARG DATABASE_URL
ARG DIRECT_URL
ARG NEXT_PUBLIC_CLIENTVAR
WORKDIR /app
RUN env
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN \
    if [ -f yarn.lock ]; then SKIP_ENV_VALIDATION=1 yarn build; \
    elif [ -f package-lock.json ]; then SKIP_ENV_VALIDATION=1 npm run build; \
    elif [ -f pnpm-lock.yaml ]; then npm install -g pnpm && SKIP_ENV_VALIDATION=1 pnpm run build; \
    else echo "Lockfile not found." && exit 1; \
    fi

##### RUNNER

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

ENV NEXT_TELEMETRY_DISABLED=1

# Install openssl for compat and link to new location
# https://github.com/nodejs/docker-node/issues/2175
RUN apk add --no-cache openssl
RUN ln -s /usr/lib/libssl.so.3 /lib/libssl.so.3

# Install prisma cli for generation
RUN yarn add prisma

# Copy compiled build
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy prisma schema/client
COPY --from=builder /app/prisma ./prisma

# Copy start executable
COPY --from=builder /app/launch.sh ./launch.sh
RUN sed -i -e 's/\r$//' ./launch.sh
RUN chmod +x ./launch.sh

# Expose port and set 
EXPOSE 3000
ENV PORT=3000

ENTRYPOINT ["/app/launch.sh" ]