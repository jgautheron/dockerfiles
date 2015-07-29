### Run PHPStorm

```bash
docker run --rm --name php-storm --net=host -v ~:/home/phpstorm/ -v /tmp/.X11-unix:/tmp/.X11-unix -e DISPLAY=unix$DISPLAY --device /dev/snd quay.io/nexway/phpstorm:<Version>
```

### Requirements

xhost local:root
