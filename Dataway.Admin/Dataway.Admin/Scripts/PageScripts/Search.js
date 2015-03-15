$(document).ready(function () {
    $("#Reindex").click(function () {

        $.ajax({
            type: "GET",
            url: "/reindex-search",
            success: function (data) {
                //alert("Reindexing complete.");
                document.location.reload(true)
            },
            error: function () { alert("Fail!"); }
        });

    });
});