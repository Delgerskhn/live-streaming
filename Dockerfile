FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 8888
EXPOSE 1935

RUN apk update 
RUN apk add ffmpeg
ENV APP_HOST=http://103.50.205.199:3000
ENV FFMPEG_PATH=/usr/bin/ffmpeg

CMD ["npm", "start"]
