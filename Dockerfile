FROM    node:lts-bullseye-slim
ENV     NODE_ENV=production
ENV     APP_ENV=prod

WORKDIR /workspace

COPY    . .

RUN npm install pm2 -g

RUN apt-get update && apt-get install -y --no-install-recommends apt-utils iputils-ping iproute2 net-tools

EXPOSE 8321

CMD     ["pm2-runtime", "start", "index.js"]
# CMD ["node", "--inspect=9421", "index.js"]
