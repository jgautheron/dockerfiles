# PhpStorm
PhpStorm in a container. This `Dockerfile` is considered generic, extend it to implement your organisation specificities (theme, plugins, formatting, macros...).

### How to use
First pull the container.
```bash
docker pull jgautheron/phpstorm:latest
```

Then run it!
```bash
docker run -it \
   -v /tmp/.X11-unix:/tmp/.X11-unix \
   -v $HOME/.WebIde90:/root/.WebIde90 \
   -v $HOME/projects:/workspace \
   --device /dev/snd \
   -e DISPLAY=$DISPLAY \
   jgautheron/phpstorm:latest
```

### Troubleshooting

`# 'Gtk: cannot open display: :0'`  
Try to set `DISPLAY=your_host_ip:0` or run `xhost +` on your host.  
[Read here](http://stackoverflow.com/questions/28392949/running-chromium-inside-docker-gtk-cannot-open-display-0) for more info.