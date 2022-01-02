FROM node:16-alpine as builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build

FROM node:16-alpine
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile
COPY --from=builder /app/.next/ /app/.next/
COPY --from=builder /app/public/ /app/public/

EXPOSE 3000
CMD yarn start

