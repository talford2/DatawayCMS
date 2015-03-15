$(document).ready(function () {

    $(".delete").click(function () {
        var self = $(this);
        var id = self.attr("id").split("_")[1];

        if (confirm("Are you sure you want to delete this setting?")) {
            $.ajax({
                type: "POST",
                url: "/settings/delete",
                data: {
                    SettingId: id
                },
                success: function (data) {

                },
                error: function (xhr, ajaxOptions, thrownError) {
                    alert("error");
                }
            });

            self.closest("tr").remove();
        }
    });
});