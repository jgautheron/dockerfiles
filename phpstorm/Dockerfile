# docker run -it \
#   -v /tmp/.X11-unix:/tmp/.X11-unix \
#   -v $HOME/.WebIde90:/root/.WebIde90 \
#   -v $HOME/projects:/workspace \
#   --device /dev/snd \
#   -e DISPLAY=$DISPLAY \
#   jgautheron/phpstorm
#
FROM alpine:3.2
MAINTAINER Jonathan Gautheron <jgautheron@neverblend.in>
ENV VERSION 9.0.2

# copy saved settings
# see https://www.jetbrains.com/phpstorm/help/project-and-ide-settings.html
#ADD config /root/.WebIde90

RUN apk --update add openjdk7-jre ttf-dejavu wget tar ca-certificates

RUN mkdir -p /usr/src/phpstorm && \
    wget -qO - http://download.jetbrains.com/webide/PhpStorm-${VERSION}.tar.gz | tar zaxf - -C /usr/src/phpstorm --strip-components=1

# cleanup the container
RUN apk del wget && \
    rm -fR /var/cache/apk/*

ENTRYPOINT [ "/usr/src/phpstorm/bin/phpstorm.sh" ]
