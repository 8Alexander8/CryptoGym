(function ($) {

  "use strict"; // Start of use strict

  // Toggle the side navigation
  $("#sidebarToggle, #sidebarToggleTop").on("click", function (e) {
    $("body").toggleClass("sidebar-toggled");
    $(".sidebar").toggleClass("toggled");
    if ($(".sidebar").hasClass("toggled")) {
      $(".sidebar .collapse").collapse("hide");
    }
  });

  // Close any open menu accordions when window is resized below 768px
  $(window).resize(function () {
    if ($(window).width() < 768) {
      $(".sidebar .collapse").collapse("hide");
    }
  });

  // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
  $("body.fixed-nav .sidebar").on("mousewheel DOMMouseScroll wheel", function (
    e
  ) {
    if ($(window).width() > 768) {
      var e0 = e.originalEvent,
        delta = e0.wheelDelta || -e0.detail;
      this.scrollTop += (delta < 0 ? 1 : -1) * 30;
      e.preventDefault();
    }
  });

  // Scroll to top button appear
  $(document).on("scroll", function () {
    var scrollDistance = $(this).scrollTop();
    if (scrollDistance > 100) {
      $(".scroll-to-top").fadeIn();
    } else {
      $(".scroll-to-top").fadeOut();
    }
  });

  // Smooth scrolling using jQuery easing
  $(document).on("click", "a.scroll-to-top", function (e) {
    var $anchor = $(this);
    $("html, body")
      .stop()
      .animate({
          scrollTop: $($anchor.attr("href")).offset().top
        },
        1000,
        "easeInOutExpo"
      );
    e.preventDefault();
  });
})(jQuery); // End of use strict

//-----------------------------------------------------------------------------------------------------------------------


//Data Table Initializing
$("#table_id").dataTable({
  "order": [
    [2, "desc"]
  ],
  responsive: true,
});
$("#table_watchlist").dataTable({
  responsive: true
});
$("#table_portfolio").dataTable({
  responsive: true
});
$("#table_leaderboard").dataTable({
  "order": [
    [2, "desc"]

  ],
  // "bSort": false,
  "paging": false,
  "searching": false,
  "info": false,
  "columnDefs": [{
    "targets": [0, 1, 2],
    "orderable": false
  }]
  // "responsive": true
});


//Blog Post
$(".sub-comment").hide()
$(".text").click(function () {
  $(".text").hide();
});
$(".showComment").click(function () {
  $(".sub-comment").slideToggle()
})
$(".cancel-btn").click(function () {
  $(".text").show();
});

$('.text').click(function () {
  $(".add-comment").slideToggle("slow");
});

$('.post-comment-btn').click(function () {
  var data = $('.example-textarea').val();
  if (!data) {
    alert("Plese Enter value after click button post comment..");
  } else {
    $('.example-textarea').val('');

    $.ajax({
      url: "/dashboard/blog/comment",
      type: "post",
      data: {
        user_image: $(this).attr("data-userimg"),
        user_nickname: $(this).attr("data-usernickname"),
        post_id: $(this).attr("data-post"),
        comment: data
      },
      success: function (result) {
        if (result) {
          console.log(result)
          $(".sub-comment").append('<div class="row m-2"><div class="col-md-12"><div class="card card-white post p-2 shadow"><div class="post-heading"><div class="float-left image"><img src="/assets/uploads/images/' + result.user_image + ' "class="img-circle avatar" alt="user profile image"></div><div class="float-left meta ml-1"><div class="title"><b class="font-weight-bold">' + result.author.username + ' </b>comment.</div><p class="text-muted time font-weight-light">' + result.createdAt + '</p></div></div><div class="post-description p-1"><p>' + result.text + '</p></div></div></div></div>');
          $(".sub-comment").slideToggle()
          $(".countComment").text() = $(".countComment").text() + 1
        }
      }
    })
  }
});

$(".cancel-btn").click(function () {
  $(".add-comment").hide("slow");
});