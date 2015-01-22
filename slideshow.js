/**	
 *	vSlideshow 1.0 - JQuery Plugin
 *	Copyright 2013 Victor Cheong
 *	Dual licensed under MIT and GPL
 *
 *	vche036@gmail.com
 *	http://www.victorcheong.org
 */
(function($) {

    $.fn.slideshow = function(options) {

        // Establish our default settings
        var defaults = {
            speed: 500,
			pause: 2000,
			effect: "slide",
			tabClass: ".tab",
			prevClass: ".prev",
			nextClass: ".next",
			auto: true
		};
		
		var settings = $.extend( {}, defaults, options );
		
        return this.each( function() {
			var $this = $(this);
			var $slides = $this.children();
			var $tabs = $(settings.tabClass);
			var $prevButton = $(settings.prevClass);
			var $nextButton = $(settings.nextClass);
			var numSlides = $this.children().length;
			var index = 0;
			var timer = false;
			var run = $.fn.slideshow[settings.effect];
			
			//Initialize
			init();
			
			function init() {
				//Make first slide active
				$slides.eq(index).toggleClass("active");
				$tabs.eq(index).toggleClass("active");
				clickHandler();
				mouseHandler();
				keyHandler();
				
				//Start slideshow
				if(settings.auto == true) startTimer();
			}
			
			function startTimer() {
				if(timer == false) {
					timer = setInterval(function(){
						nextSlide();
					}, settings.pause);
				}
			}
			
			function stopTimer() {
				clearInterval(timer);
				timer = false;
			}
			
			//Slide handler
			function nextSlide(direction, jumpTo) {
				//Check not animating
				if($this.is(":animated") == false) {
					//Do not change order of execution
					run($this, settings, direction, index, jumpTo);
					activeHandler(direction, jumpTo);
				}
			}
			
			//Toggle active class
			function activeHandler(direction, jumpTo) {
				$slides.removeClass("active");
				$tabs.removeClass("active");
				if(jumpTo != undefined) {
					index = jumpTo;
					jumpTo = undefined;
				} else if(direction == "prev") {
					if(index <= 0) index = numSlides;
					index--;
				} else {
					if(index >= numSlides -1) index = -1;
					index++;
				}
				$slides.eq(index).toggleClass("active");
				$tabs.eq(index).toggleClass("active");
			}	
			
			//Click handler
			function clickHandler() {
				$prevButton.click(function() {
					nextSlide("prev");
					return false;
				});
				$nextButton.click(function() {
					nextSlide();
					return false;
				});
				$tabs.click(function() {
					nextSlide(null, $(this).index())
					return false;
				});
			}
			
			//Mouse control
			function mouseHandler() {
				var isRunning;
				$slides.add($tabs).add($prevButton).add($nextButton)
				.mouseover(function() {
					isRunning = timer;
					stopTimer();
				})
				.mouseout(function() {
					if(isRunning) startTimer();
				});
			}
			
			//Keyboard control
			function keyHandler() {
				$("body").keypress(function( event ) {
					if(event.key == "Left") {
						event.preventDefault();
						stopTimer();
						nextSlide("prev");
					} else if(event.key == "Right") {
						event.preventDefault();
						stopTimer();
						nextSlide();
					}
				});
			}			
			
        });
    };
	
	//Slide effect
	$.fn.slideshow.slide = function($this, settings, direction, index, jumpTo) {
		var numSlides = $this.children().length;
		var width = $this.children().width();
		var speed = settings.speed;

		//Clicked on tab
		if(jumpTo != undefined) {
			var distance = width * Math.abs(jumpTo - index);
			if(jumpTo > index) {
				 $this.animate({ "left": "-=" + distance}, speed);
			} else {
				$this.animate({ "left": "+=" + distance}, speed);
			}
		//Clicked on prev
		} else if(direction == "prev") {
			//if before first slide jump to end
			if($this.css("left") >= 0 + "px") {
				$this.children(":last").clone().prependTo($this);
				$this.css("left", -width);//clone fix
				$this.animate({ 
					"left": "+=" + width
				}, speed, function() {
					$this.css("left", width*-(numSlides-1));
					$this.children(":first").remove();
				});
			}else {
				$this.animate({ "left": "+=" + width}, speed);
			}
		//Next	
		} else {	
			//if reached the last slide, jump to start
			if($this.css("left") <= width*-numSlides + "px") {
				//append start to end
				$this.children(":first").clone().appendTo($this);
				//animate slide
				$this.animate({ 
					"left": "-=" + width
				}, speed, function() {
					//reset to start
					$this.css("left", 0);
					$this.children(":last").remove();
				});
			}else {
				//normal slide animation
				$this.animate({ "left": "-=" + width}, speed);
			}
		}
	};
	
}(jQuery));
