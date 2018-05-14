
//FastClick
if (typeof FastClick !== 'undefined')
{
    FastClick.attach(document.body);
}

//旋转层
$('body').rotaryScreenLayer({
    imgNameHorizontal: 'css/images/orientation.png'
});

//分享层
$('.shareLayerBtn').on('click', function ()
{
    $('body').shareLayer({
        src: 'css/images/share.png',
        addClass: 'shareLayer-2',
    });
});

//音乐
$('body').h5MusicBtn({
    musicSrc: 'css/images/music.mp3',
    openSrc: 'css/images/music-btn-open.png',
    closeSrc: 'css/images/music-btn-close.png',
});












// 代言人特权
$('.tip').on('click', function(){
    $('.dyrtq').show();
})
$('.dyrtq').on('touchmove', function(e){
    e = e || window.event;
    if (e.preventDefault)
        e.preventDefault();
    e.returnValue = false;
})
$('.dyrtq a').on('click', function(){
    $('.dyrtq').hide();
})


$('.footer').on('click', function(){
    if(!$('#picDom').attr('src')){
        tool.alert('请先上传照片');
        return;
    }
    if(!$('.name').val()){
        tool.alert('请填写姓名');
        return;
    }
    $('.tel_box').show();
})
/*function bodyScale(){
    var devicewidth=document.documentElement.clientWidth;
    var scale=devicewidth/640;
    document.body.style.zoom=scale;
}
window.onload=window.onresize=function(){
    bodyScale();
}*/


var tool = {
    alert: function(val){
        window.wxc.xcConfirm(val);
    }
}


// 上传图片
$('.upload_box').on('change', function(e){
    imgUpload.upload(e)
})


var imgUpload = {
    maxSize: 20,
    createObjectURL: function(blob){
        return window['URL']['createObjectURL'](blob);
    },
    upload: function(e){
        var that = this;

        var file = e.target.files[0];
        e.target.value = '';
        if(file.type.indexOf('image') < 0){
            tool.alert('请上传图片');
            return;
        }
        if((file.size/1024/1024).toFixed(2) * 1 > this.maxSize){
            tool.alert('图片不能大于' + this.maxSize + 'M');
            return;
        }
        //显示本地图片
        var url = that.createObjectURL(file);
        console.log(url);
        $('#pic').attr('src', url)
        $('.pic_box').show();
    }
}


//绑定参数
$('#fileDom').uploadFile({
    //file选择框Id
    fileId: 'fileDom',
    //canvasId
    canvasId: 'canvas',
    //图片父类Id
    picFaId: 'picFaId',
    //图片Id
    picId: 'picDom',
    //图片最大的宽高
    _max: 800,
    callback: function () {
        $('#fileDom').appendTo('.reSelect');
        $('.reSelect').show();
    }
});


//submit
$('.submit').on('click', function ()
{
    if($('#tel').val() == '' || $('#tel').val().length != 11){
        tool.alert('请填写正确的手机号码！');
        return;
    }
    
    
    /*---------------截屏生成canvas返回图片---------------*/
    var targetDom = $("#bg"); //需要截图的区域框id
    var copyDom = targetDom.clone();
    copyDom.width(targetDom.width() + "px");
    copyDom.height(targetDom.height() + "px");
    $(copyDom).addClass('temp_bg');
    $('body').append(copyDom);

    var dom = targetDom; //你要转变的dom
    var width = dom.width();
    var height = dom.height();
    var type = "png";
    var scaleBy = 3;  //缩放比例
    var canvas = document.createElement('canvas');
    canvas.width = width * scaleBy;
    canvas.height = height * scaleBy;  //35是我处理完后发现短了一点，具体为什么不清楚,如果你也少的话，根据自己的项目调吧
    canvas.style.width = width * scaleBy + 'px';
    canvas.style.height = height * scaleBy + 'px';
    
    
    var context = canvas.getContext('2d');
    context.scale(scaleBy, scaleBy);


    //返回顶部
    $(window).scrollTop(0);
    $('.uploadPicLoadBox2').show();
    
    html2canvas(dom, {
        allowTaint: true, // 允许跨域
        height: $(".bg_pic").outerHeight(), //设置需要的高度
        taintTest: false,
        //scale: 2,
        canvas: canvas,
        onrendered : function(canvas) {
            var picBase64 = canvas.toDataURL('image/png', 1);
            //picBase64 = Canvas2Image.convertToImage(canvas,width* scaleBy,height* scaleBy,type);
            //console.log(picBase64)
            $('.temp_bg').remove();

            postPic && postPic(picBase64);

            /*$('.cover_img').attr('src', picBase64);
            $('.cover').show();
            $('.page').hide();


            setTimeout(function(){
                $('.uploadPicLoadBox2').hide();
            }, 800)*/
        }
    });
})

//createPic
function createPic(base64){
    $('.cover_img').attr('src', base64);
    $('.cover').show();
    $('.page').hide();

    setTimeout(function(){
        $('.uploadPicLoadBox2').hide();
    }, 800)
}



