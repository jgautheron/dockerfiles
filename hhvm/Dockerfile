FROM ubuntu:trusty
MAINTAINER Jonathan Gautheron <jgautheron@tenwa.pl>

ENV DEBIAN_FRONTEND noninteractive

ENV APP_FOLDER /var/www/app
ENV PHP_INI_DIR /etc/hhvm/

RUN apt-get install -yqq --no-install-recommends software-properties-common && \
    apt-key adv --recv-keys --keyserver hkp://keyserver.ubuntu.com:80 0x5a16e7281be7a449 && \
    add-apt-repository 'deb http://dl.hhvm.com/ubuntu trusty main' && \
    apt-get update && \
    apt-get install -yqq --no-install-recommends hhvm supervisor cron

RUN /usr/bin/update-alternatives --install /usr/bin/php php /usr/bin/hhvm 60

COPY config/hhvm/php.ini $PHP_INI_DIR/

# Cleanup the container
RUN apt-get purge -yqq software-properties-common && \
    apt-get autoremove -yqq && \
    apt-get clean all && \
    rm -rf /var/lib/apt/lists/*

# Scripts
ADD config/supervisord.conf /etc/supervisor/supervisord.conf
ADD supervisor-config/ /etc/supervisor/conf.d/
ADD scripts/ /scripts/
RUN chmod 755 /scripts/*.sh

# Add crontab file
ADD crontab /etc/cron.d/appstore-cron
RUN chmod 0644 /etc/cron.d/appstore-cron

VOLUME ["/etc/hhvm"]

EXPOSE 9000
CMD ["/scripts/start.sh"]