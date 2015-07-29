FROM phusion/baseimage

ENV VERSION=70
ADD install /install
ADD config /root/.WebIde$VERSION

RUN apt-get update && apt-get install -y \
  libpangoxft-1.0-0 \
  alsa-utils \
  software-properties-common \
  default-jdk \
  --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

ENTRYPOINT [ "/install/bin/phpstorm.sh" ]
