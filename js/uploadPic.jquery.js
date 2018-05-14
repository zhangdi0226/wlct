/*
	上传图片
*/
/*---------------file---------------*/
; (function ($)
{

    /*
		touchZoom
	*/
    var imgObj = {
        imgId: $('#picDom'),
        imgIdName: 'picDom',
        x: '',
        y: '',
        x1: '',
        x2: '',
        y1: '',
        y2: '',
        d1: '',
        oldX: '',
        oldY: '',
        startX: '',
        startY: '',
        startWidth: '',
        startHeight: '',
        moveD: '',
        isMove: false,
        isZoom: false,
        lastClickTime: 0
    }

    // 获取两点之间的距离
    function get_distance(x1, y1, x2, y2)
    {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2), 2);
    }
    function img_mousedown(e)
    {
        e.preventDefault();

        if (e.target.id != imgObj.imgIdName) return;

        if (e.touches.length == 1)
        {
            var nowTime = Math.round(new Date().getTime() / 1000);
            imgObj.x = imgObj.imgId.position().left;
            imgObj.y = imgObj.imgId.position().top;
            if (nowTime - imgObj.lastClickTime < 1 && Math.abs(imgObj.x - imgObj.startX) < 20 && Math.abs(imgObj.y - imgObj.startY) < 20)
            {
                // 在1秒内连续点击同一地方。
                //alert('双击事件');
            }
            imgObj.lastClickTime = nowTime;
        }
        else if (e.touches.length >= 2)
        {
            imgObj.isMove = false;
            imgObj.isZoom = true;
            imgObj.x1 = e.touches[0].pageX;
            imgObj.y1 = e.touches[0].pageY;
            imgObj.x2 = e.touches[1].pageX;
            imgObj.y2 = e.touches[1].pageY;

            imgObj.startX = imgObj.imgId.position().left;
            imgObj.startY = imgObj.imgId.position().top;
            imgObj.startWidth = imgObj.imgId.width();
            imgObj.startHeight = imgObj.imgId.height();

            imgObj.moveD = get_distance(imgObj.x1, imgObj.y1, imgObj.x2, imgObj.y2);

            return;
        }
        imgObj.isMove = true;
        imgObj.oldX = e.touches[0].pageX;
        imgObj.oldY = e.touches[0].pageY;
        imgObj.startX = imgObj.imgId.position().left;
        imgObj.startY = imgObj.imgId.position().top;
        e.preventDefault();
        e.stopPropagation();
        return false;
    }

    function img_mouseup(e)
    {
        if (e.target.id != imgObj.imgIdName)
        {
            return;
        }
        imgObj.isZoom = false;
        imgObj.isMove = false;
    }

    function img_mousemove(e)
    {
        if (imgObj.isZoom)
        {
            //targetTouches changedTouches touches
            if (e.touches.length >= 2)
            {
                imgObj.x1 = e.touches[0].pageX;
                imgObj.y1 = e.touches[0].pageY;
                imgObj.x2 = e.touches[1].pageX;
                imgObj.y2 = e.touches[1].pageY;
                imgObj.d1 = get_distance(imgObj.x1, imgObj.y1, imgObj.x2, imgObj.y2);
                var rate = imgObj.d1 / imgObj.moveD;
                var w = imgObj.startWidth * rate;
                var h = imgObj.startHeight * rate;

                imgObj.imgId.width(w);
                imgObj.imgId.height(h);
                imgObj.imgId.css('left', (imgObj.startWidth - w) / 2 + imgObj.startX + 'px');
                imgObj.imgId.css('top', (imgObj.startHeight - h) / 2 + imgObj.startY + 'px');

            }

            return;
        }

        if (!imgObj.isMove) return;
        imgObj.x = e.changedTouches[0].pageX - imgObj.oldX;
        imgObj.y = e.changedTouches[0].pageY - imgObj.oldY;

        imgObj.imgId.css('top', imgObj.y + imgObj.startY + 'px');
        imgObj.imgId.css('left', imgObj.x + imgObj.startX + 'px');

    }

    //默认值配置
    var defaults = {
        fileId: 'fileDom',
        canvasId: 'canvas',
        picFaId: 'pic',
        picId: 'picDom',
        _max: 500,
        callback: function () { }
    }
    $.extend($.fn, {
        "uploadFile": function (opts)
        {
            var opts = $.extend({}, defaults, opts);
            var fileDom = document.getElementById(opts.fileId);
            var $this = this;
            var domThis = $(this);
            if (typeof FileReader != 'undefined')
            {
                fileDom.addEventListener('change', readFile, false);
            } else
            {
                //alert('抱歉，你的浏览器不支持 FileReader！');
            }


            /*---------------readFile---------------*/
            function readFile()
            {
                var file = fileDom.files[0];
                var mpImg = new MegaPixImage(file);
                var resCanvas = document.getElementById(opts.canvasId);
                if (!/image\/\w+/.test(file.type))
                {
                    alert('文件必须为图片！');
                    return false;
                }

                var pic = document.getElementById(opts.picFaId);

                //加载dom
                var loadDiv = $('<div class="uploadPicLoadBox">\
					<div class="uploadPicLoad">\
						<div class="loadBox">\
						<div class="load8">\
							<div class="load8-container container1">\
								<div class="circle1"></div>\
								<div class="circle2"></div>\
								<div class="circle3"></div>\
								<div class="circle4"></div>\
							</div>\
							<div class="load8-container container2">\
								<div class="circle1"></div>\
								<div class="circle2"></div>\
								<div class="circle3"></div>\
								<div class="circle4"></div>\
							</div>\
							<div class="load8-container container3">\
								<div class="circle1"></div>\
								<div class="circle2"></div>\
								<div class="circle3"></div>\
								<div class="circle4"></div>\
							</div>\
						</div>\
						</div>\
					</div>\
				</div>').appendTo('#' + opts.picFaId);

                //上传文件
                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function (e)
                {
                    var result = this.result;
                    var image = new Image();
                    image.src = result;
                    image.onload = function ()
                    {
                        EXIF.getData(image, function ()
                        {
                            mpImg.render(resCanvas, {
                                maxHeight: opts._max,
                                maxWidth: opts._max,
                                orientation: EXIF.getTag(image, 'Orientation'),
                                callback: function ()
                                {
                                    if (document.getElementById(opts.picId) === null)
                                    {
                                        var img = document.createElement('img');
                                        img.id = opts.picId;
                                        img.style.cssText = 'position:absolute;top:0;left:0;';
                                        img.src = canvasToSrc(resCanvas);

                                        img.onload = function ()
                                        {
                                            var _w = this.width;
                                            var _h = this.height;
                                            var bi = this.width / this.height;
                                            if (_w > _h && _w > 600)
                                            {
                                                _w = 600;
                                                _h = _w / bi;
                                            } else if (_h > _w && _h > 600)
                                            {
                                                _h = 600;
                                                _w = bi * _h;
                                            }

                                            var hw = $('#' + opts.picFaId).width() * 0.5;
                                            var hh = $('#' + opts.picFaId).height() * 0.5;
                                            this.style.cssText = 'height:' + _h + 'px;width:' + _w + 'px;position:absolute;top:' + (_h * -0.5 + hh) + 'px;left:' + (_w * -0.5 + hw) + 'px;';

                                        }

                                        pic.appendChild(img);

                                        imgObj.imgId = $('#' + opts.picId);
                                        imgObj.imgIdName = opts.picId;

                                        document.getElementById(opts.picId).addEventListener('touchstart', img_mousedown, false);
                                        document.getElementById(opts.picId).addEventListener('touchend', img_mouseup, false);
                                        document.getElementById(opts.picId).addEventListener('touchmove', img_mousemove, false);

                                    } else
                                    {
                                        document.getElementById(opts.picId).src = canvasToSrc(resCanvas);
                                        document.getElementById(opts.picId).style.cssText = 'position:absolute;top:0;left:0;width:auto;height:auto;';
                                    }
                                    loadDiv.remove();
                                }
                            });

                                
                            
                        })
                        opts.callback();
                    }
                }
            }

            /*---------------画布返回成图片链接---------------*/
            function canvasToSrc(canvas)
            {
                var src = canvas.toDataURL('image/jpeg', 1);
                return src;
            }


        }
    });
})(jQuery);




