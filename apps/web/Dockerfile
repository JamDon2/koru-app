FROM node:22-alpine AS base

FROM base AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./

COPY tsconfig.base.json /

COPY apps ./apps
COPY packages ./packages

RUN pnpm deploy --filter=web web

RUN cd web && pnpm build


FROM base AS runner

WORKDIR /app

COPY --from=builder /app/web/public ./public
COPY --from=builder /app/web/.next/standalone .
COPY --from=builder /app/web/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]