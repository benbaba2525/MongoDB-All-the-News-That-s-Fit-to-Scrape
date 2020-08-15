
// Index Page
$(document).ready(function () {

    $("#scrapeBtn").on("click", function (event) {
        event.preventDefault();
        $.get("/newscrape", function (data) {
            location.reload();
             
        });
         alert("=== SCRAPED NEW ARTICLES !! ===");
    });

    $("#save-article").on("click", function (event) {
        event.preventDefault();
        console.log("save it!");
        var id = $(this).children().val();
        console.log(id);
        var data = {
            _id: id
        }
        $.ajax("/update/" + id, {
            type: "PUT",
            data: data
        })
        location.reload();
        alert("=== SUCESSFULLY SAVED !! ===");
    });

});

// Saved Page

$(document).ready(function () {
    $("#new-note").on("submit", function (event) {
        event.preventDefault();
        console.log("new note");
        var id = $(this).children().val();
        console.log(id);
        var newNote = $(this).children("#message").val();
        console.log(id);
        console.log(newNote);
        var data = {
            _id: id,
            note: newNote
        }
        console.log(data);
        $.ajax({
            type: "PUT",
            url: "/newnote/" + id,
            data: data
        })
        location.reload();
        $("#message").val("");
    });
    $("#delete-article").on("click", function (event) {
        event.preventDefault();
        console.log("delete it!");
        var id = $(this).children().val();
        console.log(id);
        var data = {
            _id: id
        }
        $.ajax("/delete/" + id, {
            type: "DELETE",
            data: data
        })
        location.reload();
        alert("=== REMOVED ARTICLE FROM SAVED!! ===");
    });

});