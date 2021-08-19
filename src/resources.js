var folder = "";

if (!cc.sys.isNative)
{
    folder = "assets/sprites/";
    path = "assets/sounds/";
}

var res = {
    ButtonNormal_png : folder +"button_normal.png",
    ButtonSelected_png : folder +"button_selected.png",
    BG : folder + "background.jpg",
    icons_plist: folder + "icons.plist",
    icons_png: folder + "icons.png",
    Button_Sound: path + "btns.mp3",
    Spin_Sound: path + "spin.mp3",
    Reel: folder + "frame.png",
    Frame: folder + "frame.png"
};

var g_resources = [];

for ( var i in res ) {
   g_resources.push( res[i] );
}