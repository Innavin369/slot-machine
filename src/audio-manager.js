AudioManager = cc.Scene.extend({
    ctor: function (){
        this._super();
    },
    playReelStart () {
        cc.audioEngine.playEffect(res.Spin_Sound, false);
        this.playReelStop(4);
    },
    playReelRoll () {
        this.playSound(res.Button_Sound);
    },
    playReelStop (time) {
        this.scheduleOnce(this.stopMusic, time);
    },
    playSound:function(audioClip){
        //audio play
        if (!audioClip){
            return;
        }
        cc.audioEngine.playMusic(audioClip, false);
    },
    stopMusic: function() {
        cc.audioEngine.stopMusic();
    }
});