// Grab the articles as a json
$(document).ready(function() {
    $(".lead").on("click", "#scrape", () => {

        $.get("/scrape", () => {
            console.log("scraped")
        })
        $.getJSON("/articles", data => {
            // For each one
            for (let i = 0; i < data.length; i++) {
                // Display the apropos information on the page
                var articleDiv = $("<div>");
                var deleteButton = $("<button>");
                var saveButton = $("<button>");
                var title = $("<p>");
                var link = $("<a>");
                link.attr({
                    href: data[i].link,
                    target: "_blank"
                });
                link.text("Link to the Artical");
                deleteButton.addClass("btn btn-primary btn-lg delete");
                deleteButton.attr( "delete-id", data[i]._id );
                deleteButton.text("Delete");
                saveButton.addClass("btn btn-primary btn-lg save");
                saveButton.attr("save-id", data[i]._id );
                saveButton.text("Save");
                articleDiv.addClass("storage");
                articleDiv.attr("id",data[i]._id);
                title.attr("title-id", data[i]._id);
                title.text(data[i].title);
                // title.addClass("artical")
                articleDiv.append(title, saveButton, deleteButton, link);
                $("#articles").append(articleDiv);
            }
        });
    });


    // Whenever someone clicks a p tag
    $("#articles").on("click","p", () => {

        // Empty the notes from the note section
        $("#notes").empty();
        // Save the id from the p tag
        var thisId = $(this).attr("title-id");
        console.log(thisId);
        


      $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
    //   console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

    $("#articles").on("click", ".delete", () => {
        console.log("delete");
        var id = $(this).attr("delete-id");
        console.log(id);
    })
    $("#articles").on("click", ".save", () => {
        console.log("save");
        var id =$(this).attr("save-id");
        console.log(id);
    })


    // When you click the savenote button
    $(document).on("click", "#savenote", function() {
        // Grab the id associated with the article from the submit button
        var thisId = $(this).attr("data-id");

        // Run a POST request to change the note, using what's entered in the inputs
        $.ajax({
                method: "POST",
                url: "/articles/" + thisId,
                data: {
                    // Value taken from title input
                    title: $("#titleinput").val(),
                    // Value taken from note textarea
                    body: $("#bodyinput").val()
                }
            })
            // With that done
            .then(function(data) {
                // Log the response
                console.log(data);
                // Empty the notes section
                $("#notes").empty();
            });

        // Also, remove the values entered in the input and textarea for note entry
        $("#titleinput").val("");
        $("#bodyinput").val("");
    });
});