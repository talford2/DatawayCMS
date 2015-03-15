$(document).ready(function () {


    $(".delete").click(function () {
        if (confirm("Are you sur eyou want to delete this asset category?")) {
            var self = $(this);
            var id = self.attr("id").split("_")[1];
            $.ajax({
                type: "POST",
                url: "delete-asset-category",
                data: { id: id },
                success: function (data) {
                    self.closest("tr").hide();
                },
                error: function () { alert("Fail!"); }
            });
        }
    });

});