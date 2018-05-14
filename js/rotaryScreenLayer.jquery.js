/* 
页面加载组件
 */
; (function ($)
{
    //默认值配置
    var defaults = {
        opacity: '0.8',
        z_index: '999990',
        //根目录
        rootList: '',
        imgName: 'http://lib.ycsgame.com/plugin/rotaryScreenLayer/images/orientation.png',
        addStyle: '',
        horizontal: false,
        imgNameHorizontal: 'http://lib.ycsgame.com/plugin/rotaryScreenLayer/images/orientationHorizontal.png',
        onBefore: function () { },
        //callback: function () { }
    }
    $.extend($.fn, {
        'rotaryScreenLayer': function (opt)
        {
            var $this = this;
            var domThis = $(this);

            var opts = $.extend({}, defaults, opt);
            if (typeof (opt) === 'string')
            {
                opts.imgName = opt;
            }
            opts.onBefore();
            if (opts.horizontal) opts.imgName = opts.imgNameHorizontal;
            $this.$rotaryScreenLayer = $('<div class="orientation ' + opts.addStyle + '" id="rotaryScreenLayer">\
<style>\
/*横竖屏遮罩层*/\
.orientation{background-color:rgba(0,0,0,0.7);width:100%;height:100%;position:fixed;top:0;left:0;z-index:999999;overflow:hidden;display:none;}\
            .orientation .orientationTable{display:table;height:100%;width:100%;}\
            .orientation .or_middle{display:table-cell;vertical-align:middle;}\
            .orientation .orientationBox{text-align:center;text-align:center;}\
            .orientation .orientationBox img{width:300px;margin:0 auto;}\
</style>\
											<div class="orientationTable">\
												<div class="or_middle">\
													<div class="orientationBox">\
														<img src="'+ opts.rootList + opts.imgName + '" />\
													</div>\
												</div>\
											</div>\
										</div>\
										');
            
            $this.$rotaryScreenLayer.appendTo('body').bind('touchmove', function (e)
            {
                e.preventDefault();
            });

            if (typeof (opts) === "string" || typeof (opts) === "number")
            {

            }

            $this.orientation = function ()
            {
                if (window.orientation == 90 || window.orientation == -90)
                {
                    if (!opts.horizontal)
                    {
                        $this.$rotaryScreenLayer.show();
                    } else
                    {
                        $this.$rotaryScreenLayer.hide();
                    }
                } else
                {
                    if (!opts.horizontal)
                    {
                        $this.$rotaryScreenLayer.hide();
                    } else
                    {
                        $this.$rotaryScreenLayer.show();
                    }
                }
            }
            $this.orientation();
            $(window).on('orientationchange', function ()
            {
                $this.orientation();
            });
        }
    });
})(jQuery);







