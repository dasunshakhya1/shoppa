FROM node:current-alpine3.16
WORKDIR /app
COPY . /app
RUN npm install
USER 10014
EXPOSE 8080
CMD ["node","app.js"]
