/*
setting.js
*/

'use strict';

// scroll
(function($){
	$('a[href^="#"]').click(function(){
		var speed = 500;
		var href = $(this).attr('href');
		var offset = 80;
		var position = $(href).offset().top - offset;
		$('html, body').animate({scrollTop:position}, speed, 'swing');
		return false;
	});
})( jQuery );


// restrict-multibyte
(function($){
	$('.restrict_mb').change(function(){
		var str = $(this).val();
		str = str.replace( /[Ａ-Ｚａ-ｚ０-９－！”＃＄％＆’（）＝＜＞，．？＿［］｛｝＠＾～￥]/g, function(s) {
			return String.fromCharCode(s.charCodeAt(0) - 65248);
		});
		$(this).val(str);
	}).change();
})( jQuery );


/*
// gnav sub-menu dropdown
(function($) {
	$('.pulldown').css('display', 'none');
	$('.has-child').click(function() {
		if ($(this).children('ul.pulldown').is(':visible')) {
			$(this).children('ul.pulldown').slideUp();
			if($(this).children('a').hasClass('icon-triangle03')){
				$(this).children('a').removeClass('icon-triangle03').addClass('icon-triangle01');
			}
		} else {
			$('.pulldown').slideUp();
			if($('.has-child').children('a').hasClass('icon-triangle03')){
				$('.has-child').children('a').removeClass('icon-triangle03').addClass('icon-triangle01');
			}
			$(this).children('ul.pulldown').slideDown();
			if($(this).children('a').hasClass('icon-triangle01')){
				$(this).children('a').removeClass('icon-triangle01').addClass('icon-triangle03');
			}
		}
		return false;
	});
})(jQuery);
*/


// sp navigation dropdown
(function($){
	$('.sub-header').css('display', 'none');
	$('.menu-btn').click(function() {
		if ($('.sub-header').css('display') == 'none') {
			$('.header-area .open').css('display', 'none');
			$('.header-area .close').css('display', 'block');
			$('.sub-header').slideDown();
			$('.headerbox').css('position', 'absolute');
			$('.sp-original.mainimagearea').css('display', 'none');
			$('.inner-wrapper').css('display', 'none');
			$('.footer').css('display', 'none');
		} else {
			$('.header-area .close').css('display', 'none');
			$('.header-area .open').css('display', 'block');
			$('.footer').css('display', 'block');
			$('.inner-wrapper').css('display', 'block');
			$('.sp-original.mainimagearea').css('display', 'block');
			$('.headerbox').css('position', 'fixed');
			$('.sub-header').slideUp();
		}
		return false;
	});
})(jQuery);


// sp add-nav dropdown
(function($){
	$('.pulldown-addnav').css('display', 'none');
	$('.btn-addnav').click(function(){
		if ($('.pulldown-addnav').css('display') == 'none') {
			$('.pulldown-addnav').slideDown();
		} else {
			$('.pulldown-addnav').slideUp();
		}
	});
})(jQuery);


// window.onloadおよびwindow.resizeでの処理
(function($){
	$(window).on('load resize', function(){
		var w = $(window).width();
		var x = 768;
		if (w < x) {
			// tab search menu
			$('.tab-content:not(".active + .tab-content")').css('display', 'none');
			$('.tab').click(function(){
				$('.tab').removeClass('active');
				$(this).addClass('active');
				$('.tab-content:not(".active + .tab-content")').fadeOut();
				$('.active + .tab-content').fadeIn();
			});
			// top scroll button
			$('.gototop').hide();
		} else {
			// top scroll button
			$('.gototop').hide();
			$(window).on('scroll', function() {

				if ($(this).scrollTop() > 400) {
					$('.gototop').slideDown('fast');
				} else {
					$('.gototop').slideUp('fast');
				}
				$(window).bind('scroll', function() {
					var scrollHeight = $(document).height();
					var scrollPosition = $(window).height() + $(window).scrollTop();
					var footHeight = $('footer').innerHeight();
					if ( scrollHeight - scrollPosition <= ( footHeight - 30 ) ) {
						$('body').css('position', 'relative');
						$('.gototop').css({
							'position' : 'absolute',
							'right'    : '30px',
							'bottom'   : footHeight + 20
						});
					} else {
						$('.gototop').css({
							'position' : 'fixed',
							'right'    : '30px',
							'bottom'   : '50px'
						});
					}
				});
			});
			$('.gototop a').click(function () {
				$('body,html').animate({
				scrollTop: 0
				}, 500);
				return false;
			});

			$(window).on('scroll', function() {
				if ($(document).scrollTop() > 250) {
					$('.secondary-header').slideDown();
				} else {
					$('.secondary-header').slideUp();
				}
			});
		}
	});
})(jQuery);
