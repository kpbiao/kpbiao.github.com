(function($) {
    $.fn.lazyload = function(options) {
        var settings = {
            placeholder: 'http://img01.taobaocdn.com/tps/i1/T16TxlFehaXXc6Yc2r-1-1.gif',
            threshold: 50,
            container: window
        };
        
        if (options) {
            $.extend(settings,options);
        }
        
        var imgs = this,            
            textareas = $('textarea[class="data-lazyload"]'); //目前暂时支持全页面(window)的textarea
                
        this.each(function() {
            _addPlaceHolderImg(this);           
        });
        
         //添加占位图片
        function _addPlaceHolderImg(img) {                        
            var jThis = $(img);
                        
            if (jThis.attr('data-src')) {                
                jThis.attr('src',settings.placeholder);
            }
        };
                
        //延迟渲染textarea中的内容
        function _lazyRendingTextArea() {            
            textareas.each(function() {
                if (_intens(this,settings.container)) {
                    var parent = $(this).parent(),
                        html = $(this).val();     
                    
                    //jquery在处理大段的html过程中，有些bug
                    //parent.html(html);
                    //用这种方式处理的话，需要避免textarea中存在script标签，因为innerHTML不能执行html中(内联或者外置)的脚本
                    parent[0].innerHTML = html;
                    var newImgs = $('img',parent[0]);
                    newImgs.each(function(){
                        _addPlaceHolderImg(this);
                    })
                        
                    this.loaded = true;
                
                    //过滤已经加载过的textarea，防止重复加载
                    var tempTextArea = $.grep(textareas, function(textarea) {
                        return !textarea.loaded;
                    });
                    textareas = $(tempTextArea);                  
                    
                    $.merge(imgs,$.makeArray(newImgs));
                    
                    $(settings.container).trigger('scroll');
                }
            })            
        }
               
        //延迟图片加载
        function _lazyLoadImage() {            
            imgs.each(function(){
                var jThis = $(this);                
                if (jThis.attr('data-src') && _intens(this,settings.container)) {
                    jThis.hide().attr('src',jThis.attr('data-src')).fadeIn();
                    jThis.removeAttr('data-src');
                    jThis.loaded = true;
                    
                    //过滤已经加载过的图片，防止重复加载
                    var tempImgs = $.grep(imgs, function(img) {
                        return !img.loaded;
                    });
                    imgs = $(tempImgs);
                }
            })
        }
        
        //绑定容器的scroll以及resize事件
        $(settings.container).bind('scroll resize',function(){
            /*
            if (timeid) {
                clearTimeout(timeid);
            }
            */
            //var timeid = setTimeout(function(){
                    _lazyRendingTextArea();
                    _lazyLoadImage();
            //},500)
        });
        
        //判断当前元素是否在容器内(rect1=>元素，rect2=>容器)
        function _intens(rect1,rect2) {    
            var jRect1 = $(rect1),
                jRect2 = $(rect2),
                cW = jRect2.width(),
                cH = jRect2.height(),
                cSL = jRect2.scrollLeft(),
                cST = jRect2.scrollTop(),
                eW = jRect1.width(),
                eH = jRect1.height(),
                offset = jRect1.offset(),
                eL = offset.left,
                eT = offset.top;
                                  
            return (eT + eH * settings.threshold/100.00) <= (cH + cST) && (eL + eW * settings.threshold/100.00) <= (cW + cSL);
        }
        
        //强制触发一次
        $(settings.container).trigger('scroll');        
    }    
})(jQuery)