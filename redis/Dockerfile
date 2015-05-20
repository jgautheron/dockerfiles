FROM ubuntu:trusty
MAINTAINER Jonathan Gautheron <jgautheron@tenwa.pl>

RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv C7917B12 && \
    apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install --no-install-recommends -y --force-yes redis-server pwgen && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Add scripts
ADD run.sh /run.sh

# Optimisations
COPY sysctl.conf /etc/sysctl.conf
COPY sysfs.conf /etc/sysfs.conf
#RUN echo never | sudo tee /sys/kernel/mm/transparent_hugepage/enabled \
#    && echo never | sudo tee /sys/kernel/mm/transparent_hugepage/defrag

ENV REDIS_PASS **None**
ENV REDIS_DIR /data
VOLUME ["/data"]

EXPOSE 6379
CMD ["/run.sh"]