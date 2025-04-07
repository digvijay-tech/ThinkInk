FROM node:22

WORKDIR /thinkink-app

COPY . .

ENV NODE_ENV=production

RUN npm i && npm run build

EXPOSE 8080

CMD ["npm", "run", "start"]

