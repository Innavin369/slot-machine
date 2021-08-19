StartScene = cc.Scene.extend({
        onEnter:function () {
            this._super();
            this.addChild(new BackgroundLayer(), 0);
            this.addChild(new Reels(), 2);
            this.addChild(new UILayer(), 3);
        }
});
