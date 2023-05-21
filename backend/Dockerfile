FROM nikolaik/python-nodejs:latest

WORKDIR /usr/src/app

COPY package*.json ./

RUN pip install numpy pandas scikit-learn scipy

RUN npm install

COPY . .

EXPOSE 8080

CMD ["node", "index.js"]