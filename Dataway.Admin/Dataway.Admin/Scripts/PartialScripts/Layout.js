var layout = {

    init: function () {
        $("#CurrentSite").change(function () {
            $.ajax({
                type: "POST",
                url: "/set-site",
                data: { SiteId: $(this).val() },
                success: function (data) {
                    window.location.reload();
                },
                error: function () { alert("Failed to set site!"); }
            });
        });
    },
};

$(function () {
    layout.init();
});