FROM node:10.16.3

RUN mkdir /led-selling

WORKDIR /led-selling

ADD ./led-selling /led-selling

RUN npm install

EXPOSE 8000

CMD [ "npm", "start" ]
