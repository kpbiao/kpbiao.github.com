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
            textareas = $('textarea[class="data-lazyload"]'); //Ŀǰ��ʱ֧��ȫҳ��(window)��textarea
                
        this.each(function() {
            _addPlaceHolderImg(this);           
        });
        
         //���ռλͼƬ
        function _addPlaceHolderImg(img) {                        
            var jThis = $(img);
                        
            if (jThis.attr('data-src')) {                
                jThis.attr('src',settings.placeholder);
            }
        };
                
        //�ӳ���Ⱦtextarea�е�����
        function _lazyRendingTextArea() {            
            textareas.each(function() {
                if (_intens(this,settings.container)) {
                    var parent = $(this).parent(),
                        html = $(this).val();     
                    
                    //jquery�ڴ����ε�html�����У���Щbug
                    //parent.html(html);
                    //�����ַ�ʽ����Ļ�����Ҫ����textarea�д���script��ǩ����ΪinnerHTML����ִ��html��(������������)�Ľű�
                    parent[0].innerHTML = html;
                    var newImgs = $('img',parent[0]);
                    newImgs.each(function(){
                        _addPlaceHolderImg(this);
                    })
                        
                    this.loaded = true;
                
                    //�����Ѿ����ع���textarea����ֹ�ظ�����
                    var tempTextArea = $.grep(textareas, function(textarea) {
                        return !textarea.loaded;
                    });
                    textareas = $(tempTextArea);                  
                    
                    $.merge(imgs,$.makeArray(newImgs));
                    
                    $(settings.container).trigger('scroll');
                }
            })            
        }
               
        //�ӳ�ͼƬ����
        function _lazyLoadImage() {            
            imgs.each(function(){
                var jThis = $(this);                
                if (jThis.attr('data-src') && _intens(this,settings.container)) {
                    jThis.hide().attr('src',jThis.attr('data-src')).fadeIn();
                    jThis.removeAttr('data-src');
                    jThis.loaded = true;
                    
                    //�����Ѿ����ع���ͼƬ����ֹ�ظ�����
                    var tempImgs = $.grep(imgs, function(img) {
                        return !img.loaded;
                    });
                    imgs = $(tempImgs);
                }
            })
        }
        
        //��������scroll�Լ�resize�¼�
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
        
        //�жϵ�ǰԪ���Ƿ���������(rect1=>Ԫ�أ�rect2=>����)
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
        
        //ǿ�ƴ���һ��
        $(settings.container).trigger('scroll');        
    }    
})(jQuery)