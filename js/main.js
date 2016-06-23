//this is where we apply opacity to the arrow
var lastScrollTop = 0, delta = 5;
$(window).scroll( function(){
  //get scroll position
  var topWindow = $(window).scrollTop();
  //multipl by 1.5 so the arrow will become transparent half-way up the page
  var topWindow = topWindow * 1.5;
  //get height of window
  var windowHeight = $(window).height();
  //set position as percentage of how far the user has scrolled
  var position = topWindow / windowHeight;
  //invert the percentage
  position = 1 - position;
  //define arrow opacity as based on how far up the page the user has scrolled
  //no scrolling = 1, half-way up the page = 0
  $('.arrow_fade').css('opacity', position);

  //Now, check if we are scrolling down or up (to hide or show the nav)
  if(Math.abs(lastScrollTop - topWindow) <= delta) return;
  if (topWindow > lastScrollTop) {
      $("nav").addClass("scroll_down");
  } else {
      $("nav").removeClass("scroll_down");
  }
  lastScrollTop = topWindow;
});

$(document).ready(function() {

  //add link styles (adding an icon to outgoing links)
  //defineLinkStyles();

  //startpage animation stuff goes here!
  setTimeout(function(){
    //This just sets the welcome animation to skip if you have already been here :)
    localStorage.setItem('visitState','true');
  }, 8000)
  //The following allows the user to skip the animation by clicking multiple times
  var animState = 0;
  setTimeout(function(){
    animState = 1;
  }, 6500)

  var visitState = localStorage.getItem('visitState');
  if (visitState == "true") {
    $('body').addClass('skip');
    animState = 1;
    //set skip_tip to active (change color)
    $('.skip_tip').addClass('active');
    //hide skip_tip
    setTimeout(function(){
        $('.skip_tip').css('opacity', '');
    }, 100)
  }

  var skipClicks = 0;
  $('.hero').click(function() {
    //check if animation is completed
    if (animState == 0) {
      skipClicks = skipClicks + 1;

      $('.skip_tip').css('opacity', 1);

      setTimeout(function(){
        $('.skip_tip').css('opacity', '');
        skipClicks = skipClicks - 1;
      }, 1200)

      if (skipClicks > 1) {
        $('body').addClass('skip');
        animState = 1;
        //set skip_tip to active (change color)
        $('.skip_tip').addClass('active');

        //hide skip_tip
        setTimeout(function(){
          $('.skip_tip').css('opacity', '');
        }, 100)
      }
    }
  });

});

/* uncomment to add an "outgoing" link style icon to outgoing links
function defineLinkStyles() {
    $("a").each( function() {
        var elem = $(this);
        if(elem.attr("data-link") == "outgoing") {
            elem.append("<i class='fa fa-link outgoing' aria-hidden='true'></i>");
        }
    });
}
*/

//
// MODAL WINDOWS
//

//trigger function to open modal and set content
$(".open_modal").click(function() {
    var origin = $(this);
    //get information of which modal content to set
    var data = origin.attr("data-modal");

    var modalBg = $(".modal_bg")

    if (modalBg.hasClass("modal_bg_open")) {
        modalContentSwitch(data);
    } else {
        openModalAnim(origin, data);
    }

});

//trigger function to change modal content from within modal (no opening)
$(".modal_switch").click(function() {
    var origin = $(this);
    var data = origin.attr("data-modal");
    modalContentSwitch(data);
});


function modalContentSwitch(data) {
    var content = "modal_" + data;
    $(".modal").removeClass().addClass("modal");
    $(".modal").addClass(content);
}

//function to open the modal with nice animation bits
function openModalAnim(origin, data) {
    var offset = origin.offset();
    var width = origin.width();
    var height = origin.height();
    var viewportTop = $(window).scrollTop();
    var bottom = (viewportTop + $(window).height()) - (offset.top + height);
    var right = $(window).width() - (offset.left + width);
    var top =  offset.top - viewportTop;
    var content = "modal_" + data;

    //stop scrolling on page behind modal
    //gets the current scroll position, sets the body to position:fixed; and the "top" value to the current scroll position (as a negative)
    //makes the page stay in the same spot, but not hide the scrollbar -- prevents weird jumping behavior when the scrollbar disappears
    var scrollPosition = $(window).scrollTop();
    var scrollPosition = (scrollPosition * -1);
    $("body").css({"top": scrollPosition});
    $("body").addClass("stop_scrolling");
    $(".modal_content").scrollTop(0);

    //create an element from the position of the clicked (origin) and start an animation
    $(".modal_anim_wrap").append("<div class='modal_anim'><div class='anim_front'></div><div class='anim_back'></div></div>");
    $(".modal_anim_wrap").addClass("anim_active");
    $(".modal_anim").css({'top': top, 'left': offset.left, 'bottom': bottom, 'right': right});
    setTimeout(function() {
        $(".modal_anim").addClass("modal_in");
        setTimeout(function() {
            $(".modal_bg").addClass("modal_bg_open");
        }, 150)
    }, 10)

    //clear the animation bits and fade in the content -- timeout should correspond to animation length (in css)
    setTimeout(function() {
        $(".modal").addClass(content);
        $(".modal_anim_wrap").removeClass("anim_active");
        $(".modal_anim").remove();
    }, 810)
}

//close the modal
$(".modal_bg").click(function() {
    closeModal();
});

function closeModal() {
    var scrollPosition = $("body").css("top");
    scrollPosition = parseInt(scrollPosition);
    scrollPosition = scrollPosition * -1;
    $(".modal").removeClass("modal_achieve modal_data");
    $(".modal_bg").removeClass("modal_bg_open");

    //removes scroll stopper and resents scroll position
    $("body").removeClass("stop_scrolling");
    $("body").css({"top": ""}).scrollTop(scrollPosition);
}

//https://css-tricks.com/snippets/jquery/smooth-scrolling/
$(function() {
  $('a[href*=#]:not([href=#])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top
        }, 600);
        return false;
      }
    }
  });
});
