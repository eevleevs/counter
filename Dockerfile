FROM node
WORKDIR /app
COPY . .
RUN npm install
RUN npm install chart.js
RUN npm install express-http-proxy
# RUN npm run build
EXPOSE 3000
CMD npm run dev
# CMD npm start