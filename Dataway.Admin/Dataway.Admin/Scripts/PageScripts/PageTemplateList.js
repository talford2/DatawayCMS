$(document).ready(function () {
    
    $(".delete").click(function () {
        var self = $(this);
        var id = self.attr("id").split("_")[1];

        if (confirm("Are you sure you want to delete this template?")) {
            self.closest("tr").hide();
            $.ajax({
                type: "POST",
                url: "/page-template/delete",
                data: {
                    PageTemplateId: id
                },
                success: function (data) {
                    
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    alert("error");
                }
            });

        }
    });
});