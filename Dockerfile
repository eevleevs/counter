FROM node
WORKDIR /app
COPY * /app
RUN npm install
RUN npm install chart.js
RUN npm run build
EXPOSE 3000
CMD npm start