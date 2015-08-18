# PhpStorm
PhpStorm in a container. This `Dockerfile` is considered generic, extend it to implement your organisation specificities (theme, plugins, formatting, macros...).

### How to use
First pull the container.
```bash
docker pull jgautheron/phpstorm:9.0.2
```

Then run it!
```bash
docker run -it \
   -v /tmp/.X11-unix:/tmp/.X11-unix \
   -v $HOME/.WebIde90:/root/.WebIde90 \
   -v $HOME/projects:/workspace \
   --device /dev/snd \
   -e DISPLAY=$DISPLAY \
   phpstorm
```