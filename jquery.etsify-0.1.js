/*
 * Etsy Navigation - jQuery plugin by Emmanuel Laborin laborin@gmail.com
 * js code
 *
 */

// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined )
{

	// undefined is used here as the undefined global variable in ECMAScript 3 is
	// mutable (ie. it can be changed by someone else). undefined isn't really being
	// passed in so we can ensure the value of it is truly undefined. In ES5, undefined
	// can no longer be modified.

	// window and document are passed through as local variable rather than global
	// as this (slightly) quickens the resolution process and can be more efficiently
	// minified (especially when both are regularly referenced in your plugin).

	// Create the defaults once
	var pluginName = "etsyNavigation";
	var defaults = {};

	// The actual plugin constructor
	function Plugin ( element, options )
	{
		this.element = element;
		this.settings = $.extend( {}, defaults, options );
		this._defaults = defaults;
		this._name = pluginName;
		this.init();
	}

	Plugin.prototype =
	{
		init: function ()
		{
			var container = this.element;
			var lastFingerPosition = 0;
			var lastFingerPositionContent = 0;
			var lastFingerPositionContentY = 0;
			var accumulativeFingerPositionContent = 0;
			var fixVertical = false;
			
			//Fire on window resize
			var containerResize = function()
			{
				//updates the content area size
				$(".etsyNavigation_container > div:first").css(
				{
					height: $(container).height() -45
				});
				
				//Updates the menu size and position
				var menuWidth = 0;
				$(".etsyNavigation_container > header > nav > ul > li").each(function()
				{
					//if($(container).width() > 500)
					//{
						$(this).css({margin: "0 "+($(container).width() / 8)+"px"});
						//}else
					//{
					//	$(this).css({margin: "0 30px"});
					//}
					menuWidth += $(this).outerWidth( true );
					$(this).parent().parent().css({width: menuWidth+"px"});
					$(this).parent().css({width: menuWidth+5+"px"});
				});
				var sectionWidth = 0;
				$(".etsyNavigation_container > div > section > div").css({width: $(container).width()+"px", height: ($(container).height()-45)+"px"});
				$("#etsyNavigation_container_section_wrapper").css({width: $(container).width()+"px", height: ($(container).height() -45)+"px"});
				$(".etsyNavigation_container > div > section > div").each(function()
				{
					sectionWidth += $(this).outerWidth( true );
					$(this).parent().css({width: sectionWidth+5+"px"});
				});
				
				//If container is shorter than the menu width, lets push the menu to the left
				if($(container).width() < menuWidth)
				{
					var offset = (menuWidth - $(container).width()) / 2;
					$(".etsyNavigation_container > header > nav").css({marginLeft: "-"+offset+"px"});
				}else
				{
					$(".etsyNavigation_container > header > nav").css({marginLeft: 0});
				}
				animateMenu(0);
				if(container.tagName=="BODY")
				{
					$(document).scrollTop(0);
					$(document).scrollLeft(0);
				}
			};
			//Animate the menu to place the currently selected option in the center
			var animateMenu = function(milliseconds)
			{
				var wasLoop = false;
				var offset = ($(".etsyNavigation_selectedMenu").parent().outerWidth(true) / 2)+ $(".etsyNavigation_selectedMenu").parent().position().left;
				if($(".etsyNavigation_selectedMenu").parent().hasClass("etsyNavigation_dummy"))	wasLoop = true;
				
				$(".etsyNavigation_container > header > nav > ul").stop().animate({marginLeft: "-"+offset+"px"},(wasLoop ? milliseconds / 2 : milliseconds),function()
				{
					if($(".etsyNavigation_selectedMenu").parent().hasClass("etsyNavigation_dummy"))
					{
						var data_menu = $(".etsyNavigation_selectedMenu").parent().attr("data-menu");
						$(".etsyNavigation_selectedMenu").removeClass("etsyNavigation_selectedMenu");
						$(this).children().each(function()
						{
							if($(this).attr("data-menu") == data_menu && !$(this).hasClass("etsyNavigation_dummy"))
							{
								$(this).find("a").addClass("etsyNavigation_selectedMenu");
								offset = ($(".etsyNavigation_selectedMenu").parent().outerWidth(true) / 2)+ $(".etsyNavigation_selectedMenu").parent().position().left;
								$(".etsyNavigation_container > header > nav > ul").css({marginLeft: "-"+offset+"px"});
							}
						});
						
						var contentOffset = $(".etsyNavigation_container > div > section").find("#"+$(".etsyNavigation_selectedMenu").parent().attr("data-menu")).position().left;
						$(".etsyNavigation_container > div >section").stop().animate({marginLeft: "-"+contentOffset+"px"},milliseconds/2);
					}
				});
				if(wasLoop)
				{
					if($(".etsyNavigation_selectedMenu").parent().next().hasClass("etsyNavigation_dummy"))
					{
						//Content coming from the right
						var loopOffset = $(".etsyNavigation_container > div > section").find("#"+$(".etsyNavigation_selectedMenu").parent().attr("data-menu")).outerWidth(true);
						$(".etsyNavigation_container > div >section").css({marginLeft: loopOffset+"px"});
					}
					else
					{
						var loopOffset = $(".etsyNavigation_container > div > section").find("#"+$(".etsyNavigation_selectedMenu").parent().attr("data-menu")).outerWidth(true);
						$(".etsyNavigation_container > div >section").css({marginLeft: "-"+$(".etsyNavigation_container > div >section").outerWidth(true)+loopOffset+"px"});
					}
					
				}else
				{
					var contentOffset = $(".etsyNavigation_container > div > section").find("#"+$(".etsyNavigation_selectedMenu").parent().attr("data-menu")).position().left;
					$(".etsyNavigation_container > div >section").stop().animate({marginLeft: "-"+contentOffset+"px"},milliseconds);
				}
			};
			//Event binding, jquery way
			$(window).resize(function()
			{
				containerResize();
			});
			
			
			
			//Apply styles
			$(this.element).addClass("etsyNavigation_container");
			if(this.element.tagName=="BODY") $(this.element).css({"margin": "0 0 0 0"});
			
			
			$(".etsyNavigation_container > section:first").wrap("<div id='etsyNavigation_container_section_wrapper'/>");
			
			
			
			
			var tempHtml = $(".etsyNavigation_container > header > nav > ul").html();
			var $tempHtmlWrapped = $("<ul>"+tempHtml+"</ul>");
			$tempHtmlWrapped.children().addClass("etsyNavigation_dummy");
			tempHtml = $tempHtmlWrapped.html();
			//Set the first menu element the selected one
			$(".etsyNavigation_container > header > nav > ul > li > a:first").addClass("etsyNavigation_selectedMenu");
			$(".etsyNavigation_container > header > nav > ul").prepend(tempHtml);
			$(".etsyNavigation_container > header > nav > ul").append(tempHtml);
			//Fires the container resize at least one time
			containerResize();
			
			//When a menu is clicked, it is the new selected one
			$(".etsyNavigation_container > header > nav > ul > li > a").click(function()
			{
				$(".etsyNavigation_selectedMenu").removeClass("etsyNavigation_selectedMenu");
				$(this).addClass("etsyNavigation_selectedMenu");
				animateMenu(300);
			});
			//Animates the menu at least one time at page load
			animateMenu(300);
			
			$(".etsyNavigation_container > div >section>div").bind( "touchmove", function(e)
			{
				$(".etsyNavigation_container > div >section>div").scrollLeft(0);
			});
			//Touch events setup for the header
			$(".etsyNavigation_container > header :first").get(0).addEventListener('touchstart', function(event)
			{
				var touch = event.touches[0];
				lastFingerPosition = touch.pageX;
			}, false);
			$(".etsyNavigation_container > header :first").get(0).addEventListener('touchmove', function(event) {
				event.preventDefault();
				var touch = event.touches[0];
				var newFingerPosition = touch.pageX;
				var deltaX = newFingerPosition - lastFingerPosition;
				
				$(".etsyNavigation_container > header > nav > ul").stop();
				$(".etsyNavigation_container > header > nav > ul").css({marginLeft: "+="+deltaX+"px"});
				
				$(".etsyNavigation_container > header > nav > ul > li > a").each(function()
				{
					var inverso = $(".etsyNavigation_container > header > nav > ul:first").css("marginLeft");
					inverso = inverso.replace("px", "");
					inverso = parseInt(inverso);
					inverso *= -1;
					if($(this).parent().position().left <= inverso && ($(this).parent().position().left + $(this).parent().outerWidth(true)) >= inverso)
					{
						$(".etsyNavigation_selectedMenu").removeClass("etsyNavigation_selectedMenu");
						$(this).addClass("etsyNavigation_selectedMenu");
					}
				});
				
				lastFingerPosition = newFingerPosition;
			}, false);
			$(".etsyNavigation_container > header :first").get(0).addEventListener('touchend', function(event)
			{
				animateMenu(300);
			}, false);
			
			//Touch events setup for the content
			$("#etsyNavigation_container_section_wrapper").get(0).addEventListener('touchstart', function(event)
			{
				var touch = event.touches[0];
				lastFingerPositionContent = touch.pageX;
				lastFingerPositionContentY = touch.pageY;
				accumulativeFingerPositionContent = touch.pageX;
				fixVertical = false;
			}, false);
			$("#etsyNavigation_container_section_wrapper").get(0).addEventListener('touchmove', function(event) {
				//event.preventDefault();
				var touch = event.touches[0];
				var newFingerPosition = touch.pageX;
				var deltaX = newFingerPosition - lastFingerPositionContent;
				var deltaX2 = newFingerPosition - accumulativeFingerPositionContent;
				var deltaY = Math.abs(touch.pageY - lastFingerPositionContentY);
				
				if(deltaY > 65) fixVertical = true;
				
				if(Math.abs(deltaX2) > 65 && !fixVertical)
				{
					event.preventDefault();
					$(".etsyNavigation_container > div >section").stop();
					$(".etsyNavigation_container > div > section").css({marginLeft: "+="+deltaX+"px"});
				}
				if(Math.abs(deltaX2) > 170 && !fixVertical)
				{
					if(deltaX2 > 0)
					{
						//left
						if(!$(".etsyNavigation_selectedMenu").parent().is(":first-child"))
						{
							var pushToRight = false;
							if($(".etsyNavigation_selectedMenu").parent().prev().hasClass("etsyNavigation_dummy")) pushToRight = true;
							
							$(".etsyNavigation_selectedMenu").removeClass("etsyNavigation_selectedMenu").parent().prev().find("a:first").addClass("etsyNavigation_selectedMenu");
							
							if(pushToRight)
							{
								var contentOffset = $(".etsyNavigation_container > div > section").find("#"+$(".etsyNavigation_selectedMenu").parent().attr("data-menu")).position().left;
								$(".etsyNavigation_container > div >section").css({marginLeft: "-"+(contentOffset +150)+"px"});
							}
							accumulativeFingerPositionContent = newFingerPosition;
							animateMenu(300);
						}
					}else
					{
						//right
						if(!$(".etsyNavigation_selectedMenu").parent().is(":last-child"))
						{
							var pushToLeft = false;
							if($(".etsyNavigation_selectedMenu").parent().next().hasClass("etsyNavigation_dummy")) pushToLeft = true;
							
							$(".etsyNavigation_selectedMenu").removeClass("etsyNavigation_selectedMenu").parent().next().find("a:first").addClass("etsyNavigation_selectedMenu");
							
							if(pushToLeft)
							{
								var contentOffset = $(".etsyNavigation_container > div > section").find("#"+$(".etsyNavigation_selectedMenu").parent().attr("data-menu")).position().left;
								$(".etsyNavigation_container > div >section").css({marginLeft: ""+(contentOffset +150)+"px"});
							}
							accumulativeFingerPositionContent = newFingerPosition;
							animateMenu(300);
						}
					}
				}
				
				lastFingerPositionContent = newFingerPosition;
				//lastFingerPositionContentY = touch.pageY;
			}, false);
			$("#etsyNavigation_container_section_wrapper").get(0).addEventListener('touchend', function(event)
			{
				
				//$(".etsyNavigation_container > div >section>div").scrollLeft(0);
				animateMenu(300);
			}, false);
			
		}
	};

	// A really lightweight plugin wrapper around the constructor,
	// preventing against multiple instantiations
	$.fn[ pluginName ] = function ( options )
	{
		return this.each(function()
		{
			if ( !$.data( this, "plugin_" + pluginName ) )
			{
				$.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
			}
		});
	};

})( jQuery, window, document );