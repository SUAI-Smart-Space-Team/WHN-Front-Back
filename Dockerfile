FROM python
ENV NODE_ENV=production
RUN sudo apt update &&\
    sudo apt install nodejs npm &&\
    sudo npm install express &&\
    sudo npm install body-parser &&\
    sudo npm install mysql2 &&\
    sudo npm install dgram

WORKDIR /server

COPY ["./views", "config.js", "database.js", "./"]
COPY . .

CMD [ "node", "server.js 127.0.0.1 500002" ]
