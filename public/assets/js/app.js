$(document).on("click", ".comment-button", function() {

    var thisId = $(this).attr("data-id");
  
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
    .then(function(comment) {
        console.log(comment);
        $("#" + thisId).append("<h2>" + comment.headline + "</h2>");
        $("#" + thisId).append("<textarea id='comment" + comment._id + "' name='body'></textarea>");
        $("#" + thisId).append("<button data-id=" + comment._id + " data-comment=comment" + comment._id + " id='saveComment'>Save Comment</button>");
        $("#" + thisId).append("<br>");
  
        $("#" + thisId).append("<div class='card-body'>" + comment.comment.commentbody + "</div>");
      });
  });
  
  $(document).on("click", "#saveComment", function() {

    var thisComment = $(this).attr("data-comment");
    var thisId = $(this).attr("data-id");


  
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
          commentbody: $("#" + thisComment).val()
      }
    })
      .then(function(data) {
        console.log(data);
        $("#notes").empty();
      });
  
    $("#comment" + thisComment).val("");

  });