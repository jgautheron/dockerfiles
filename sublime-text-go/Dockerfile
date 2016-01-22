# docker run -it \
#   -v $HOME/workspace:/home/subl/workspace \
#   -v /tmp/.X11-unix:/tmp/.X11-unix \
#   -e DISPLAY=$DISPLAY \ 
#   jgautheron/sublime-text-go
#
FROM debian:jessie
MAINTAINER Jonathan Gautheron <jgautheron@neverblend.in>

ENV HOME /home/subl
ENV GOVERSION 1.5
ENV GOPATH /home/subl/go

# add first the subl user
RUN groupadd -r subl && useradd -m -r -g subl subl

RUN apt-get update && apt-get -y install \
    ca-certificates \
    wget \
    tar \
    bzip2 \
    git \
    libglib2.0-0 \
    libx11-6 \
    libcairo2 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libgtk2.0-0 \
    locales \
    ttf-dejavu \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# fix & set locale
RUN locale-gen en_US.UTF-8 en_us && dpkg-reconfigure locales && dpkg-reconfigure locales && locale-gen C.UTF-8 && /usr/sbin/update-locale LANG=C.UTF-8
ENV LANG C.UTF-8
ENV LANGUAGE C.UTF-8
ENV LC_ALL C.UTF-8

# grab gosu for easy step-down from root
RUN gpg --keyserver pool.sks-keyservers.net --recv-keys B42F6819007F00F88E364FD4036A9C25BF357DD4
RUN wget -O /usr/local/bin/gosu "https://github.com/tianon/gosu/releases/download/1.2/gosu-$(dpkg --print-architecture)" && \
    wget -O /usr/local/bin/gosu.asc "https://github.com/tianon/gosu/releases/download/1.2/gosu-$(dpkg --print-architecture).asc" && \
    gpg --verify /usr/local/bin/gosu.asc && \
    rm /usr/local/bin/gosu.asc && \
    chmod +x /usr/local/bin/gosu

# install Go
RUN wget -qO - https://godeb.s3.amazonaws.com/godeb-amd64.tar.gz | tar zxvf - -C /tmp && \
    /tmp/godeb install ${GOVERSION} && \
    rm -f /go*.deb && \
    rm -fR /tmp/*

# add local config
ADD sublime-text-3 /home/subl/.config/sublime-text-3

RUN go get github.com/golang/lint/golint && \
    go get golang.org/x/tools/cmd/goimports

RUN mkdir -p /home/subl/bin/subl && \
    wget -qO - http://c758482.r82.cf2.rackcdn.com/sublime_text_3_build_3083_x64.tar.bz2 | tar xjf - -C /home/subl/bin/subl --strip-components 1

RUN chown -R subl.subl /home/subl
CMD ["gosu", "subl", "/home/subl/bin/subl/sublime_text", "-w"]
