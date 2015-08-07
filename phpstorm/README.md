### PhpStorm

#### How to install

```bash
docker pull quay.io/nexway/phpstorm:$Version
```

#### Use PhpStorm Docker 

- `xhost local:root`
Give rights to the Graphics Interface to unknow users. Need to be launch else the docker cannot run.

- `docker run --rm --name php-storm --net=host -v $Path_To_TestFiles:/home/phpstorm/ -v $Path_To_GraphicsInterface_Files:/tmp/.X11-unix -e DISPLAY=unix$DISPLAY --device $paht_to_sound quay.io/nexway/phpstorm:$Version`
`$Path_To_TestFiles`: where you have your local files for testing. Need to be pass so the docker will have access to it
`$Path_To_GraphicsInterface_Files`: by default, should be `/tmp/.X11-unix` if you are on a linux environment. 
`$DISPLAY`: local environnement variable which have to be pass to the docker so he can run the GUI.
`$path_to_sound`: where your sound device is located. Should be `/dev/snd` if you are on a linux environment
`$Version`: PhpStorm version you want to run on the docker. 7.0, 8.0, 9.0 available for now.
