# docker run -it \
#   -v /tmp/.X11-unix:/tmp/.X11-unix \
#   -v $HOME:/workspace \
#   -e DISPLAY=$DISPLAY \
#   photoshop
#
FROM jess/wine
MAINTAINER Jonathan Gautheron <jgautheron@neverblend.in>

RUN apt-get update -qq && \
    apt-get install -yqq wget ca-certificates cabextract --no-install-recommends

RUN wget -O /usr/bin/winetricks https://raw.githubusercontent.com/Winetricks/winetricks/master/src/winetricks \
    && chmod +x /usr/bin/winetricks

ADD PhotoshopPortable /usr/src/Photoshop

# Photoshop CS2 dependencies
# https://appdb.winehq.org/objectManager.php?sClass=version&iId=2631
RUN echo "/usr/bin/winetricks corefonts vcrun6 && wine /usr/src/Photoshop/Photoshop.exe"

CMD [ "bash" ]
