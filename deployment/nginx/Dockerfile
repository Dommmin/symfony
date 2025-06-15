FROM nginx:stable-alpine

COPY --from=node /app/build /usr/share/nginx/html/
COPY --from=php /var/www/html/public /var/www/html/public
COPY ./deployment/nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]