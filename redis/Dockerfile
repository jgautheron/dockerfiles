FROM ubuntu:trusty
MAINTAINER Jonathan Gautheron <jgautheron@nexway.com>

RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv C7917B12 && \
    apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y redis-server pwgen && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Add scripts
ADD run.sh /run.sh

COPY sysctl.conf /etc/sysctl.conf
COPY sysfs.conf /etc/sysfs.conf

ENV REDIS_PASS **None**
ENV REDIS_DIR /data
VOLUME ["/data"]

EXPOSE 6379
CMD ["/run.sh"]