# Photoshop
Adobe Photoshop CS2 for windows in a container, running on Linux thanks to Wine.  
Photoshop CS2 has been picked specifically since it's [rated Gold](https://appdb.winehq.org/objectManager.php?sClass=version&iId=2631), it is widely considered as the most stable version when running Wine.

### Getting started

1. Clone the repo
2. Download or [create a portable version of Photoshop CS2](#create-a-portable-version-of-adobe-photoshop-cs2)
3. Save the files in the folder `dockerfiles/photoshop/PhotoshopPortable`
4. Build the container `docker build -t photoshop .`
5. And run it!
```bash
docker run -it \
   -v /tmp/.X11-unix:/tmp/.X11-unix \
   -v $HOME:/workspace \
   -e DISPLAY=$DISPLAY \
   photoshop
```

:warning: Photoshop won't be started immediately. There is some setup that needs to be done, you will enter the container in `bash`, just pull the latest command in history and run it.

<a name="create-portable"></a>
### Create a portable version of Adobe Photoshop CS2

If you don't already own a copy of Adobe Photoshop CS2, you can download the [trial version here](http://download.adobe.com/pub/adobe/photoshop/win/cs2/Photoshop_CS2.exe), then follow the instructions here to [create a portable version](http://portableapps.com/node/1426). This should keep the total image weight low (< 1 GB).
