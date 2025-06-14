FROM nginx:stable-alpine

COPY --from=node /app/public/build /usr/share/nginx/html/
COPY ./deployment/nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]