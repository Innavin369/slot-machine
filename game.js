cc.game.onStart = function () {
    cc.LoaderScene.preload(g_resources, function () {
        cc.director.runScene(new StartScene());
    }, this);
};

window.onload = function () {
    cc.game.run("gameCanvas");
}