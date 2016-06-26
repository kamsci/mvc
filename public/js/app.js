$(".list-nav").hover(function() {
  $(this).css("text-decoration", "underline");
  $(this).css("color", "purple");
}, function(){
  $(this).css("text-decoration", "none");
  $(this).css("color", "black");
});
