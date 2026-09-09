FROM public.ecr.aws/docker/library/node:22.12.0 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build 

FROM public.ecr.aws/docker/library/node:22.12.0-alpine AS production

RUN npm install -g serve

WORKDIR /app

COPY --from=builder /app/build /app/build

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]
