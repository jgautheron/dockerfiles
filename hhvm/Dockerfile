FROM debian:jessie

MAINTAINER "Jonathan Gautheron" <jgautheron@tenwa.pl>

ENV DEBIAN_FRONTEND noninteractive

ENV CORE_NUMBER 4
ENV APP_FOLDER /var/www/app
ENV HHVM_VERSION 3.6.2
ENV PHP_INI_DIR /etc/hhvm/

RUN apt-get update && apt-get install -yqq \
    supervisor cron

# persistent / runtime deps
RUN apt-get install -yqq ca-certificates curl cmake gawk libmysqlclient-dev \
        libxml2-dev libmcrypt-dev libicu-dev openssl build-essential binutils-dev \
        libcap-dev zlib1g-dev libtbb-dev libonig-dev libpcre3-dev \
        autoconf libtool libcurl4-openssl-dev wget memcached \
        libreadline-dev libncurses5-dev libmemcached-dev libbz2-dev \
        libc-client2007e-dev php5-mcrypt php5-imagick libgoogle-perftools-dev \
        libcloog-ppl-dev libelf-dev libdwarf-dev libunwind8-dev subversion \
        libtbb2 g++-4.8 gcc-4.8 libjemalloc-dev \
        libc6-dev libmpfr4 libgcc1 binutils \
        libc6 libc-dev-bin libc-bin libgomp1 \
        libstdc++-4.8-dev libstdc++6 \
        libarchive13 cmake-data libacl1 libattr1 \
        g++ cpp gcc libboost-thread1.55.0 \
        libboost-thread-dev libgd2-xpm-dev \
        libboost-system1.55-dev libboost-context1.55-dev \
        libboost-program-options1.55-dev libboost-filesystem1.55-dev libboost-regex1.55-dev \
        libmagickwand-dev libiberty-dev libevent-dev libxslt-dev libgoogle-glog-dev \
        automake libldap2-dev libkrb5-dev libyaml-dev ocaml-native-compilers \
        --no-install-recommends

# hphpize / hhvm-ext-install deps
RUN apt-get update && apt-get install -y git-core autoconf gcc libc-dev make pkg-config --no-install-recommends

RUN mkdir ${PHP_INI_DIR} \
    && mkdir /var/run/hhvm

# Compile HHVM
RUN set -x \
    && git clone git://github.com/facebook/hhvm.git /tmp/hhvm \
    && cd /tmp/hhvm \
    && git checkout tags/HHVM-${HHVM_VERSION} \
    && git submodule update --init --recursive \
    && cmake -DMYSQL_UNIX_SOCK_ADDR=/dev/null . \
    && make -j ${CORE_NUMBER} \
    && make install \
    && make clean \
    && rm -fR /tmp/* \
    && cd -

RUN /usr/bin/update-alternatives --install /usr/bin/php php /usr/local/bin/hhvm 60

COPY config/hhvm/php.ini $PHP_INI_DIR/

# Cleanup the container
RUN apt-get autoremove -yqq \
    && apt-get clean all \
    && rm -rf /var/lib/apt/lists/*

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
