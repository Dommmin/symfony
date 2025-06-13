FROM dommin/php-8.4-fpm:latest

ARG USER_ID=1000
ARG GROUP_ID=1000

COPY docker/php/start.sh /usr/local/bin/start.sh
COPY docker/php/php.ini /usr/local/etc/php/conf.d/php.ini
COPY docker/php/www.conf /usr/local/etc/php-fpm.d/www.conf
COPY docker/php/supervisord.conf /etc/supervisor/supervisord.conf

USER root

RUN chmod +x /usr/local/bin/start.sh
RUN usermod -u ${USER_ID} www-data
RUN groupmod -g ${GROUP_ID} www-data

RUN mkdir -p /var/www/html/var/log/php-fpm && \
    mkdir -p /var/www/html/var/log/nginx && \
    chown -R www-data:www-data /var/www/html/var

WORKDIR /var/www/html

USER www-data

EXPOSE 9000

CMD ["php-fpm"]
