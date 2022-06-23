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
ENV APP_HOST=https://mnlearn.herokuapp.com
ENV FFMPEG_PATH=/usr/bin/ffmpeg
ENV STORAGE_HOST=https://stream.elearn.mn


CMD ["npm", "start"]
