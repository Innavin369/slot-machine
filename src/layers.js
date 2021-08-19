Audio = new AudioManager();

BackgroundLayer = cc.Layer.extend({
    ctor:function () {
        this._super();

        var size = cc.winSize;

        this.sprite = new cc.Sprite(res.BG);
        this.sprite.setPosition( size.width * 0.5, size.height * 0.5 );
        this.addChild(this.sprite);

        return true;
    }
});

// Icons = cc.Sprite.extend({
//     ctor: function () {
//         this._super();
//
//         var size = cc.director.getWinSize();
//
//         var walk01 = cc.rect(0,0,40,60);
//         var walk02 = cc.rect(50,0,40,60);
//         var walk03 = cc.rect(100,0,40,60);
//         var walk04 = cc.rect(150,0,40,60);
//         var walk05 = cc.rect(200,0,40,60);
//         var walk06 = cc.rect(250,0,40,60);
//         var walk07 = cc.rect(300,0,40,60);
//         var frameDatas=[walk01,walk02,walk03,walk04,walk05,walk06,walk07];
//         var texture = cc.textureCache.addImage(res.icons_png);
//             // cc.spriteFrameCache.addSpriteFrames(res.icons_plist);
//
//
//         var animFrames=[];
//         for(var index in frameDatas)
//         {
//             var spriteFrame =  new cc.SpriteFrame(texture, frameDatas[index]);
//             var animFrame = new cc.AnimationFrame();
//             animFrame.initWithSpriteFrame(spriteFrame, 10, null);
//             animFrames.push(animFrame);
//         }
//         this.sprite = new cc.Sprite();
//         this.sprite.attr({ x: size.width / 2,y: size.height / 2 });
//         this.addChild(this.sprite, 0);
//         var spAnim = new cc.Animation(animFrames, 0.1);
//         var animate   = new cc.Animate(spAnim);
//         this.sprite.runAction(animate.repeatForever());
//         return true;
//     }
// });

UILayer = cc.Layer.extend({
    ctor:function () {
        this._super();

        this.createScreen();
    },
    createScreen:function () {

        var size = cc.winSize;

        var spinButton = new Button("Spin", "Spin", function () {
            // cc.director.runScene(new MenuScene);
        });
        var buttonSize = spinButton.getContentSize();
        spinButton.setPosition(size.width - buttonSize.width * 0.5, buttonSize.height * 0.5);
        spinButton.setScale(0.7);
        this.addChild(spinButton);


        var tsLabel = new cc.LabelTTF("Result:", "Arial", 38);
        tsLabel.x = size.width / 2;
        tsLabel.y = size.height / 2;
        tsLabel.setPosition(100, 50);
        this.addChild(tsLabel, 5);
    }
});

Button = ccui.Button.extend({
    ctor:function (name, caption, callback) {
        this._super();

        this.createScreen(name, caption);
        this.createListeners(callback)
    },
    createScreen:function (name, caption) {
        this.loadTextures(res.ButtonNormal_png, res.ButtonSelected_png);
        this.setName(name);

        var size = this.getContentSize();

        var captionLabel = new cc.LabelTTF(caption, "Arial", 36);
        captionLabel.setPosition(size.width * 0.5, size.height * 0.5);

        this.addChild(captionLabel);
    },
    createListeners:function (callback) {
        this.addTouchEventListener(this.touchEvent(callback), this);
    },
    touchEvent:function (callback) {
        return function (sender, type) {
            if(type === ccui.Widget.TOUCH_ENDED) {
                callback();
            } else if(type === ccui.Widget.TOUCH_BEGAN) {
                Audio.playReelStart();
                this.spin();
            }
        };
    },
    setButtonsLocked:function(isLocked){
        this.Button.isLocked=isLocked;
    },
    updateSpriteFrame: function updateSpriteFrame(sprite, texture) {
        //updates the sprite texture
        if (!sprite || !texture) {
            return;
        }
        var w = sprite.node.width,
            h = sprite.node.height,
            frame = new cc.SpriteFrame(texture, cc.rect(0, 0, w, h));
        sprite.spriteFrame = frame;
    }
});

Reels = cc.Scene.extend({
        ctor: function (){
            this._super();
        },
        onEnter: function (){

            this.size = cc.winSize;
            //create  sprite frames
            var cache = cc.spriteFrameCache;
            cache.addSpriteFrames(res.icons_plist, res.icons_png);
            this.spriteNames = [
                "#icons/CC.png",
                "#icons/DD.png",
                "#icons/EE.png",
                "#icons/WC.png",
                "#icons/WC_X2.png",
                "#icons/BL.png",
                "#icons/AA.png",
                "#icons/BB.png"];
            var animFrames = [];
            for (var i = 0; i < this.spriteNames.length; i++) {
                var frame = new cc.Sprite(this.spriteNames[i]);
                animFrames.push(frame);
            }

            //add reels background
            var spriteReels = new cc.Sprite(res.Frame);
            spriteReels.setScale(0.4);
            var reelSize = spriteReels.getContentSize();
            spriteReels.setPosition(this.size.width / 2, 320);
            this.addChild(spriteReels);

            this.winnerLineY = reelSize.height/2;
            //add winner line in the center of reels
            var line = new cc.DrawNode();
            var reelPosition = spriteReels.getPosition();
            var reelContentSize = spriteReels.getContentSize();
            line.drawSegment(
                cc.p(reelPosition.x-(reelContentSize.width/7), reelPosition.y),
                cc.p(reelPosition.x+(reelContentSize.width/7), reelPosition.y),
                2,
                cc.color(255, 0, 0, 255));
            this.addChild(line, 5);


            // this.addChild(animFrames);
            var firstStop = animFrames[0];
            this.stopHeight = firstStop.height;
            //padding: is the space between two adjacent nodes
            this.padding = (reelSize.height - (3 * this.stopHeight) ) / (3+1)

            //sets the amount of the Y translation that define the reel motion
            this.stepY = 3/5;
            //considering that the anchor point of the reel is at (0,0)
            //this loop will layou all the stops on the node (reel)
            var startY = reelSize.height -this.padding-3;
            var startX = reelSize.width/2-firstStop.width/2;
            this.stopNodes = [];

            for (var i = 0; i < animFrames.length; i++){
                var stop = animFrames[i];
                stop.setScale(0.7);
                stop.setPosition(cc.p(startX, startY));
                startY= startY - this.padding - this.stopHeight;
                this.stopNodes.push(stop);
                // this.addChild(stop);
            }
            this.tailNode = this.stopNodes[this.stopNodes.length-1];
            this.isRollingCompleted = true;
        },
        // called every frame,
        update: function (dt) {
            if (this.isRollingCompleted){
                return;
            }
            //the loop below will moove each stop of the setpY amount.
            //When the first stop is on the top of the node, will be moved after the first and will be set as tail.
            //For further informtaion take a look to the online github documentation

            for (var i = 0; i < this.stopNodes.length; i++){
                var stop = this.stopNodes[i];
                stop.y = stop.y + this.stepY;
                if (stop.y - this.padding > this.node.height){
                    if (i + 1 === this.stopNodes.length){
                        this.rollingCount++;
                    }
                    stop.y = this.tailNode.y - this.tailNode.height - this.padding;
                    this.tailNode = stop;
                }

                if (this.stopAfterRollingCount === this.rollingCount && i === this.winnerIndex){
                    if (stop.y >= this.winnerLineY){
                        if (this.winnerIndex === 0){
                            //move the tail node before the first stop (index===0)
                            this.tailNode.y = stop.y + stop.height;
                            //this.tailNode.setPosition(cc.p(stop.x, stop.y + stop.height));
                            this.tailNode = this.stopNodes[this.stopNodes.length - 2];
                        }
                        this.resetY(stop);
                        this.isRollingCompleted = true;
                        this.spriteNames.dispatchEvent( new cc.Event.EventCustom('rolling-completed', true) );
                    }
                }
            }

        },
        resetY:function(currentStop){
            //applies a correction to all the Y stops after that
            //the reel has been stopped.
            var deltaY = currentStop.y - this.winnerLineY + currentStop.height/2;
            var lastItemWon =  (this.winnerIndex === this.stopNodes.length - 1)
            for (var i = 0 ; i < this.stopNodes.length; i++){
                var newStop = this.stopNodes[i];
                newStop.y = newStop.y - deltaY;
                if (lastItemWon && newStop.y < this.winnerLineY && i !== this.winnerIndex) {
                    newStop.y = newStop.y + this.padding;
                }
            }
        },
        spin:function(){
            //start the reel spinning
            var min = 1;
            var max = 2;
            this.rollingCount = 0;
            this.stopAfterRollingCount = Math.floor(Math.random() * (max - min + 1)) + min;
            //PRNG
            //gets random value with PRNG class between a min and max value
            var randomValue = PRNG.newValue(1, 1000000000);
            //normalize with the number of stops
            this.winnerIndex = (randomValue % this.spriteNames[i].length);

            this.isRollingCompleted = false;
            //console.log (this.stopAfterRollingCount + "-" + this.winnerIndex);
        },
        getWinnerStop:function() {
            //returns the reel winnre index
            return this.stopNodes[this.winnerIndex];
        }
    })

function PRNG(){
    return{
        // Returns a random integer between min (included) and max (included)
        // Using Math.round() will give you a non-uniform distribution!
        newValue:function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    };
}
