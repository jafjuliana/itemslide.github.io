//Vendor prefixes - ['transform', 'WebkitTransform', 'MozTransform', 'OTransform', 'msTransform' ]
//about:flags


//Dependencies - jQuery and Hammer.js


(function ($) {
    "use strict";




    //extract values from transform position



    //Waypoints check position relative to waypoint and decide if to scroll to or not...
    $.fn.initslide = function (options) {




        //Includes ItemSlide variables so that they will be individual to each object that is applied with itemslide.
        var defaults = {
            duration: 250,
            swipe_sensitivity: 250,
            disable_slide: false,
            disable_autowidth: false,
            start: 0, //Until here options


            currentIndex: 0,
            currentPos: 0,
            begin: 0,
            targetFrame: 0,
            countFrames: 0,
            currentLandPos: 0,
            initialLeft: 0,
            slidesGlobalID: 0

        };

        var settings = $.extend({}, defaults, options);


        this.data("settings", settings);
        //console.log(settings);
        //calling an object stored through data method
        //$(this).data("object").duration-=23;

        var slides = $(this); //Saves the object given to the plugin in a variable

        slides.data("settings").initialLeft = parseInt(slides.css("left").replace("px", ""));

        //console.log(slides.data("settings").initialLeft);

        if (!settings.disable_autowidth)
            slides.css("width", slides.children('li').length * slides.children('li').css("width").replace("px", "") + 10); //SET WIDTH

        //console.log("WIDTH: " + slides.css("width"));

        slides.css('transform', 'translate3d(0px,0px, 0px)'); // transform according to vendor prefix

        gotoSlideByIndex(settings.start);
        // ON iPad Doesn't want to change attr att1






        var mc = new Hammer(slides.get(0)); //Retrieve DOM Elements to create hammer.js object
        var disable = false;



        mc.on("panleft panright", function (ev) { //Hammerjs pan(drag) event happens very fast







            if (!settings.disable_slide) {
                slides.css('transform', 'translate3d(' + (ev.deltaX + slides.data("settings").currentLandPos) + 'px' + ',0px, 0px)'); // transform according to vendor prefix
                slides.trigger('pan');
                slides.trigger('changePos');
                cancelAnimationFrame(slides.data("settings").slidesGlobalID);
            }

        });
        mc.on("panend", function (ev) {
            if (!settings.disable_slide) {

                var matrix = matrixToArray(slides.css("transform")); //prefix
                var value = parseFloat(matrix[4]);
                ////console.log(value + "YAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY");

                gotoSlideByIndex(getLandingSlideIndex(ev.velocityX * settings.swipe_sensitivity - value)); //HHEERRREEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE
                disable = true;
            }
        }); //WORKS!

        slides.children('li').mousedown(function (e) {


            if (window.getSelection) { //CLEAR SELECTIONS SO IT WONT AFFECT SLIDING
                if (window.getSelection().empty) { // Chrome
                    window.getSelection().empty();
                } else if (window.getSelection().removeAllRanges) { // Firefox
                    window.getSelection().removeAllRanges();
                }
            } else if (document.selection) { // IE?
                document.selection.empty();
            }

            //console.log(slides.data("settings").currentIndex);
            if ($(this).index() != slides.data("settings").currentIndex) {
                //console.log("ASD");
                gotoSlideByIndex($(this).index());
            }

        });

        $(this).on('gotoSlide', function(e , i) //triggered when object method is called
        {
            gotoSlideByIndex(i);
        });








        function changeActiveSlideTo(i) {

            slides.children(':nth-child(' + (slides.data("settings").currentIndex + 1) + ')').attr('id', ''); //WORKS!!


            settings.currentIndex = i;
            //console.log("new index: " + slides.data("settings").currentIndex);
            slides.children(':nth-child(' + (slides.data("settings").currentIndex + 1) + ')').attr('id', 'active');


        }

        function getLandingSlideIndex(x) { //Get slide that will be selected when silding occured - by position
            //console.log("Sup");
            for (var i = 0; i < slides.children('li').length; i++) {
                ////console.log(slides.children(i).css("width").replace("px","")*i);
                if (slides.children(i).css("width").replace("px", "") * i + slides.children(i).css("width").replace("px", "") / 2 > x) { /*&& slides.children(i).css("width").replace("px","")*(i+1) < x*/
                    //YAY FIXED!!!
                    //console.log(i)
                    return i;

                }

            }
            //console.log(x);
            //return slides.data("settings").currentIndex;
            return slides.children('li').length - 1;
        }
        ////console.log($('li:nth-child(' + (2)+ ')').css('width'));


        function gotoSlideByIndex(i) {


            changeActiveSlideTo(i);





            var coordinate = -(i * slides.children('li').css("width").replace("px", "") - (($("html").css("width").replace("px", "") - slides.data("settings").initialLeft - slides.children('li').css("width").replace("px", "")) / 2));


            var matrix = matrixToArray(slides.css("transform"));
            var value = parseFloat(matrix[4]);


            slides.data("settings").currentPos = value;

            slides.data("settings").currentLandPos = -(i * slides.children('li').css("width").replace("px", "") - (($("html").css("width").replace("px", "") - slides.data("settings").initialLeft - slides.children('li').css("width").replace("px", "")) / 2));


            //console.log(slides.data("settings").currentLandPos + "ccc");





            slides.data("settings").countFrames = 0;
            //MUCH WOW!!!
            slides.trigger('changeActiveItem');
            slides.data("settings").slidesGlobalID = requestAnimationFrame(repeatOften);




            //console.log("tranform3dx ::: " + value);
            ////console.log("left ::: " + slides.css("left"));


        }




        function repeatOften() {




            slides.trigger('changePos');

            slides.data("settings").currentPos -= easeOutQuart(slides.data("settings").countFrames, 0, slides.data("settings").currentPos - slides.data("settings").currentLandPos, slides.data("settings").duration); //work!! BEGIN = 0
            //to understand easing refer to: http://upshots.org/actionscript/jsas-understanding-easing
            if (slides.data("settings").currentPos == slides.data("settings").currentLandPos) {

                slides.data("settings").countFrames = 0;
                return; //out of recursion
            }





            slides.css('transform', 'translate3d(' + (slides.data("settings").currentPos) + 'px' + ',0px, 0px)'); // transform according to vendor prefix
            slides.data("settings").countFrames++;
            slides.data("settings").slidesGlobalID = requestAnimationFrame(repeatOften);


        }









    } //END OF INIT


    //SET
    $.fn.gotoSlide = function (i) {
        this.trigger('gotoSlide', i);
    }

    $.fn.next = function () { //Next slide
        //gotoSlideByIndex(this.data("settings").this.data("settings").currentIndex + 1);

        this.gotoSlide(this.data("settings").currentIndex + 1);

        //this.data("settings",settings);
    }

    $.fn.previous = function () { //Next slide
        //        gotoSlideByIndex(this.data("settings").currentIndex - 1);
        this.gotoSlide(this.data("settings").currentIndex - 1);
    }

    $.fn.reload = function () { //Get index of active slide
        this.css("width", this.children('li').length * this.children('li').css("width").replace("px", "") + 10); //SET WIDTH
        //gotoSlideByIndex(this.data("settings").currentIndex);
        this.gotoSlide(this.data("settings").currentIndex);
    }


    //GET
    $.fn.getActiveIndex = function () { //Get index of active slide
        return this.data("settings").currentIndex;
    }

    $.fn.getCurrentPos = function () { //Get current position of carousel
        var matrix = matrixToArray(this.css("transform"));
        var value = parseFloat(matrix[4]);
        return value;
    }






    function matrixToArray(matrix) {
        return matrix.substr(7, matrix.length - 8).split(', ');
    }

    function easeOutQuart(t, b, c, d) {
        t /= d;
        t--;
        return -c * (t * t * t * t - 1) + b;
    }

})(jQuery);
