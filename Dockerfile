FROM node:alpine
WORKDIR /app
RUN npm install --legacy-peer-deps gun express
COPY . .
CMD npm start