FROM node:22.20 AS builder

WORKDIR /app

COPY . .

## Preparando a aplicação
RUN npm i

RUN npm run build

FROM nginx:alpine

COPY --from=builder /dist /usr/share/nginx/html

COPY --from=builder nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
