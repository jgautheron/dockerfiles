# docker run -it \
#   -v /tmp/.X11-unix:/tmp/.X11-unix \
#   -v $HOME/.WebIde90:/root/.WebIde90 \
#   -v $HOME/projects:/workspace \
#   --device /dev/snd \
#   -e DISPLAY=$DISPLAY \
#   phpstorm

FROM debian:jessie
MAINTAINER Jonathan Gautheron <jgautheron@neverblend.in>
ENV VERSION 9.0.2

# copy saved settings
# see https://www.jetbrains.com/phpstorm/help/project-and-ide-settings.html
#ADD config /root/.WebIde90

RUN apt-get update && apt-get install -y \
  ca-certificates \
  wget \
  libpangoxft-1.0-0 \
  alsa-utils \
  software-properties-common \
  default-jdk \
  --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /usr/src/phpstorm && \
    wget -qO - http://download.jetbrains.com/webide/PhpStorm-${VERSION}.tar.gz | tar zaxf - -C /usr/src/phpstorm --strip-components=1

ENTRYPOINT [ "/usr/src/phpstorm/bin/phpstorm.sh" ]
