FROM dommin/php-8.4-fpm-alpine:latest

USER root

RUN addgroup -g 1000 appuser && \
    adduser -D -u 1000 -G appuser appuser

RUN sed -i 's/user = www-data/user = appuser/g' /usr/local/etc/php-fpm.d/www.conf && \
    sed -i 's/group = www-data/group = appuser/g' /usr/local/etc/php-fpm.d/www.conf

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY ./api/composer.json ./api/composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist --no-scripts

COPY --chown=appuser:appuser ./api .
COPY --chown=appuser:appuser ./deployment/php/supervisord.conf /etc/supervisord.conf
COPY --chown=appuser:appuser ./deployment/php/php.ini /usr/local/etc/php/php.ini
COPY --chown=appuser:appuser ./deployment/php/www.conf /usr/local/etc/php-fpm.d/www.conf

USER appuser

EXPOSE 9000

CMD ["/usr/bin/supervisord", "-n", "-c", "/etc/supervisord.conf"]
