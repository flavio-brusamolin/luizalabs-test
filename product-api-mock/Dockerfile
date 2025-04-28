FROM node:22.15.0
WORKDIR /product-api-mock
RUN npm install -g json-server
COPY products.json ./products.json
CMD ["json-server", "--watch", "/product-api-mock/products.json", "--port", "8081"]