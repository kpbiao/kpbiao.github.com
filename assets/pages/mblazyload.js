function $(id) {
	return document.getElementById(id);	
} 

//事件绑定函数
function bind(el,eventType,fn) {
	el.addEventListener(eventType,function(ev){ 
		fn.call(el,ev)
	},false);
} 

function lazyload(el_con){  
		var doc = document,
			win = window,
			win_h = win.innerHeight,
			win_w = win.innerWidth,
			scroll_top = 0,
			scroll_left = 0,
			el_con = $(el_con) || doc.body,
			arr_imgs = null,
			default_img = 'http://img04.taobaocdn.com/tps/i4/T1NdXKXotzXXXXXXXX-1-1.gif';  
		bind(doc,'DOMContentLoaded',function(ev){
			var start_Y,end_Y,scrollTop=0; 
			arr_imgs = Array.prototype.slice.call(el_con.querySelectorAll('img[data-src]')); 
			//设置图片默认src
			setDefaultImg(arr_imgs); 
			bind(win,'scroll',function(ev){
				scroll_top = doc.body.scrollTop;
				scroll_left = doc.body.scrollLeft;						
				lazyImg();
			}) 
			//初始化scroll事件
			win.scroll(0,1); 
			bind(win,'resize',function(ev){
				lazyImg();
			}) 
		}) 
		
		/*设置默认图片替换*/
		function setDefaultImg(arr_imgs) {
			for (var i = 0, len = arr_imgs.length; i < len; i++) {
				arr_imgs[i].src = default_img;
			}
		} 
		
		function lazyImg() {			
			for (var i = 0, len = arr_imgs.length; i < len; len--) {				
				var img = arr_imgs[i],
					img_top = getImgPosition(img).top;
					//img_left = getImgPosition(img).left;
	 				//console.log(img_left+ scroll_left,win_w)
				if (scroll_top + win_h >= img_top) {
					img.src = img.getAttribute('data-src'); 
					arr_imgs.splice(0,1);
				}
			}
		}
		
	 /*获取图片的相对浏览器窗口（viewport）左上角的距离*/
		function getImgPosition(img) {
			var position={
					top:img.getBoundingClientRect().top,
					left:img.getBoundingClientRect().left
				} 
		   return position;
			 
		} 
	
} 