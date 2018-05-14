; (function ()
{
    //字体比例----------------
    var fontRatio = 16
		, windowWidth
		, rootFontSize
    ;
    function modifyRootFontSize()
    {
        windowWidth = document.documentElement.clientWidth;
        rootFontSize = windowWidth / fontRatio;
        document.getElementsByTagName('html')[0].style.cssText = 'font-size:' + rootFontSize + 'px';
    }
    modifyRootFontSize();
    window.onresize = function ()
    {
        modifyRootFontSize();
    }
})();