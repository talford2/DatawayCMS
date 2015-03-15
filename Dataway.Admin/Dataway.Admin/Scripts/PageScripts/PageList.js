$(document).ready(function () {
    $(".open").click(function () {
        var self = $(this);
        self.closest("li").find("ul:first").slideUp(150);
        self.hide();
        self.closest("li").find(".close:first").show();

        var pageId = self.closest("li").find(".page-id").val();

        $.ajax({
            type: "POST",
            url: "/user-settings/set-page-expand",
            data: { PageId: pageId, isExpanded: true },
            success: function (data) { },
            error: function () { alert("Fail!"); }
        });
    });

    $(".close").click(function () {
        var self = $(this);
        self.closest("li").find("ul:first").slideDown(150);
        self.hide();
        self.closest("li").find(".open:first").show();

        var pageId = self.closest("li").find(".page-id").val();

        $.ajax({
            type: "POST",
            url: "/user-settings/set-page-expand",
            data: { PageId: pageId, isExpanded: false },
            success: function (data) { },
            error: function () { alert("Fail!"); }
        });
    });

    $(".activate").click(function () {
        //alert("Activate!");
        $(this).closest("li").removeClass("inactive");

        $(this).closest("li").find(".actions .deactivate").first().show();
        $(this).hide();

        var id = $(this).attr("id").split("_")[1];
        $.ajax({
            type: "POST",
            url: "/page/set-active",
            data: { Id: id, IsActive: true },
            success: function (data) { },
            error: function () { alert("Fail!"); }
        });
    });

    $(".deactivate").click(function () {
        //alert("Deactivate!");
        $(this).closest("li").addClass("inactive");

        $(this).closest("li").find(".actions .activate").first().show();
        $(this).hide();

        var id = $(this).attr("id").split("_")[1];
        $.ajax({
            type: "POST",
            url: "/page/set-active",
            data: { Id: id, IsActive: false },
            success: function (data) { },
            error: function () { alert("Fail!"); }
        });
    });

    $(".delete").click(function () {
        if (confirm("Are you sure you want to delete this page?")) {
            var id = $(this).attr("id").split("_")[1];

            $.ajax({
                type: "POST",
                url: "/page/delete",
                data: { Id: id },
                success: function (data) { alert("deleted1"); },
                error: function () { removeButton.show(); alert("Fail!"); }
            });

            var pageTag = $(this).closest(".actions").parent("div"); //.closest("div");
            pageTag.slideUp(200);
            pageTag.next("ul").find("li").find(".spacer:first").remove();
            $(".pages > ul").append(pageTag.next("ul").find("li"));
        }
    });

    $(".down").click(function () {

        // make first
        //$(this).closest("ul").prepend($(this).closest("li"));

        $(this).closest("li").next().after($(this).closest("li"));
        reorder();
    });

    $(".up").click(function () {
        $(this).closest("li").prev().before($(this).closest("li"));
        reorder();
    });

    $("#SaveOrder").click(function () {
        var pages = "";
        var order = 0;

        $(".PageOrder").each(function () {
            var pageId = $(this).attr("id").split("_")[1];
            pages += pageId + ",";
        });

        pages = pages.substr(0, pages.length - 1);

        $.ajax({
            type: "POST",
            url: "/reorder-pages",
            data: { PageIds: pages },
            success: function (data) { },
            error: function () { alert("Fail!"); }
        });
    });
});

function reorder() {
    var order = 0;
    $(".PageOrder").each(function () {
        $(this).val(order);
        order++;
    });
}