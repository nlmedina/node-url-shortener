FROM node:10-alpine

COPY ./ /var/www
WORKDIR /var/www
RUN ["npm", "install"]
CMD ["npm", "start"]
