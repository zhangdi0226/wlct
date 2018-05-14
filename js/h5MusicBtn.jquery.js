/*
    15-08-21
    音乐按钮
*/

;(function($) {
    //默认值配置
    var defaults = {
        musicSrc: '',
        openSrc: 'http://lib.ycsgame.com/image/music-btn-open.png',
        closeSrc: 'http://lib.ycsgame.com/image/music-btn-close.png',
        open: 'true',
        addClass: '',
        parent: 'body',
        callback: function () { },
    };
    $.extend($.fn, {
        'h5MusicBtn': function (opt)
        {
            var opts = $.extend({}, defaults, opt);
            var _this = this;
            var domThis = $(this);
            var touchstart = 'ontouchend' in document ? 'touchstart' : 'click';
            if(typeof opt == 'string'){
                opts.musicSrc = opt;
            }
            var dom = '\
                <div id="fn-audio" class="fn-audio ' + opts.addClass + '">\
                    <style>\
                        .fn-audio{position:fixed;z-index:100;width:42px;height:42px;right:15px;top:15px;}\
                        .fn-audio img{width:100%;display:block;}\
                        .fn-audio .musicS,.fn-audio .musicP{}\
                        .fn-audio .musicP{display:block;}\
                        .fn-audio .musicS{display:none;}\
                        .musicShake{border-radius:300px;border:2px solid #fff;padding:8px;width:22px;height:22px; box-shadow:0 0 3px #ccc;\
                            background-color:rgba(0,0,0,0.2);\
                        }\
                        .fn-audio.on .musicP{display:none;}\
                        .fn-audio.on .musicS{display:block;\
                            animation: musicSAms 3s linear infinite;\
                            -webkit-animation: musicSAms 3s linear infinite;\
                        }\
                        @keyframes musicSAms{\
                            0% { transform: rotate(0deg);}\
                            100% { transform: rotate(360deg);}\
                        }\
                        @-webkit-keyframes musicSAms{\
                            0% { -webkit-transform: rotate(0deg);}\
                            100% { -webkit-transform: rotate(360deg);}\
                        }\
                        #audio{ height:0;width:0;opacity:0;display:none;}\
                    </style>\
                    <div class="musicShake">\
                    <img class="musicS" src="' + opts.openSrc + '" />\
                    <img class="musicP" src="' + opts.closeSrc + '" />\
                    </div>\
                    <audio preload="preload" controls id="audio" src="' + opts.musicSrc + '" loop></audio>\
                </div>\
            ';
            $(dom).appendTo($(opts.parent));

            /*音乐*/
            var audio = $('#audio');
            var isPlaying = false;
            function playAudio() {
                //var audio = $('#audio');
                //if (audio.attr('src') == undefined) {
                //    audio.attr('src', audio.data('src'));
                //}
                audio[0].play();
                $('#fn-audio').addClass('on');
                isPlaying = true;
            }
            function pauseAudio(){
                audio[0].pause();
                $('#fn-audio').removeClass('on');
                isPlaying = false;
            }
            function audio_switch() {
                if (isPlaying) {
                    //关闭声音
                    pauseAudio();
                }
                //开启声音
                else {
                    playAudio();
                }
            }

            //绑定点击事件
            $('#fn-audio').on(touchstart, audio_switch);
            if(opts.open){
                $('#fn-audio').addClass('on');
                playAudio();
            }

            //微信接口
            document.addEventListener('WeixinJSBridgeReady', function ()
            {
                WeixinJSBridge.invoke('getNetworkType', {}, function (e)
                {
                    if (opts.open)
                    {
                        $('#fn-audio').addClass('on');
                        playAudio();
                        opts.callback();
                    }

                    //console.log(e);
                    //network = e.errMsg//结果在这里
                });
            }, false);

            return audio[0];
        }
    });
})(jQuery);