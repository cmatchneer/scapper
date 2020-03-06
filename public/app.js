// Grab the articles as a json
$(document).ready(function() {
    $(".lead").on("click", "#scrape", () => {

        $.get("/scrape", () => {
            console.log("scraped")
        })

    });
    $(".lead").on("click", "#full_list", () => {
        $.getJSON("/articles", data => {
            // For each one
            for (let i = 0; i < data.length; i++) {
                console.log();
                if (!data[i].saved) {
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
                    deleteButton.addClass("btn btn-primary btn-lg deleteArt");
                    deleteButton.attr("data-id", data[i]._id);
                    deleteButton.text("Delete");
                    saveButton.addClass("btn btn-primary btn-lg save");
                    saveButton.attr("data-id", data[i]._id);
                    saveButton.text("Save");
                    articleDiv.addClass("storage");
                    articleDiv.attr("id", "divid" + data[i]._id);
                    title.attr("data-id", data[i]._id);
                    title.text(data[i].title);
                    title.addClass("artical")
                    articleDiv.append(title, saveButton, deleteButton, link);
                    $("#articles").append(articleDiv);

                }
            }
        });
    });

    // Whenever someone clicks a p tag
    $("#articles").on("click", "p", function() {

        // Empty the notes from the note section
        $("#notes").empty();
        // Save the id from the p tag
        var thisId = $(this).attr("data-id");
        // console.log(thisId);




        $.ajax({
                method: "GET",
                url: "/articles/" + thisId
            })
            // With that done, add the note information to the page
            .then(function(data) {
                console.log(data);
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

    $("#articles").on("click", ".deleteArt", function() {
        console.log("delete");
        var id = $(this).attr("data-id");

        $.ajax({
            type: "GET",
            url: "/deleteArt/" + id,

            // On successful call
            success: function(response) {
                console.log(response);


            }

        });

        $("#divid" + id).remove();
    })
    $("#articles").on("click", ".save", function() {
        console.log("save");
        var id = $(this).attr("data-id");
        $.ajax({
            type: "POST",
            url: "/update/" + id,
            dataType: "json",
            data: {
                title: $("#title").val(),
                note: $("#note").val()
            },
            // On successful call
            success: function(data) {
                console.log(data);
            }
        });
        $("#divid" + id).remove();
    })


    // When you click the savenote button
    $("#notes").on("click", "#savenote", function() {

        // Grab the id associated with the article from the submit button
        var thisId = $(this).attr("data-id");
        const title = $("#titleinput").val()
        const body = $("#bodyinput").val()
            // Run a POST request to change the note, using what's entered in the inputs
        $.ajax({
                method: "POST",
                url: "/articles/" + thisId,
                data: {
                    // Value taken from title input
                    title: title,
                    // Value taken from note textarea
                    body: body
                }
            })
            // With that done
            .then(function(data) {
                console.log(title);
                console.log(body);
                // Log the response
                console.log(data);
                // Empty the notes section
                $("#notes").empty();
                $("#titleinput").val("");
                $("#bodyinput").val("");
            });

        // Also, remove the values entered in the input and textarea for note entry

    });
});