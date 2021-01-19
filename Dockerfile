FROM node
WORKDIR /app
COPY . .
RUN npm install
RUN npm install chart.js express express-http-proxy svelte-persistent-store
# RUN npm run build
EXPOSE 3000
CMD npm run dev
# CMD npm start