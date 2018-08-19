FROM node:7.7.3

LABEL version="1.0"
LABEL description="IoT Weather Station - Server"
LABEL maintainer="Edwin Montoya - emontoya@eafit.edu.co"

ARG PORT=3000
ENV PORT $PORT

WORKDIR /nodeApp
COPY . ./

RUN npm install --production

EXPOSE 3000
CMD npm start
