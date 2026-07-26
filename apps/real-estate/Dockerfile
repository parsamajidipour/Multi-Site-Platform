ARG NODE_IMAGE=public.ecr.aws/docker/library/node:22-alpine
ARG NGINX_IMAGE=public.ecr.aws/docker/library/nginx:1.27-alpine

FROM ${NODE_IMAGE} AS base

WORKDIR /app
ENV PATH=/app/node_modules/.bin:$PATH

COPY package*.json ./
RUN npm ci

FROM base AS dev
ENV NODE_ENV=development
EXPOSE 5173
CMD ["npm", "run", "dev"]

FROM base AS build
ARG VITE_SITE_NAME
ARG VITE_SITE_DESCRIPTION
ARG VITE_PUBLIC_URL
ARG VITE_SITE_KIND

ENV VITE_SITE_NAME=$VITE_SITE_NAME
ENV VITE_SITE_DESCRIPTION=$VITE_SITE_DESCRIPTION
ENV VITE_PUBLIC_URL=$VITE_PUBLIC_URL
ENV VITE_SITE_KIND=$VITE_SITE_KIND

COPY . .
RUN npm run build

FROM ${NGINX_IMAGE} AS prod
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
