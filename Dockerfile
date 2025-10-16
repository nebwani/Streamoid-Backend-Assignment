FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm install -g wait-port

EXPOSE 8000

CMD ["sh", "-c", "wait-port db:5432 && npm run dev"]