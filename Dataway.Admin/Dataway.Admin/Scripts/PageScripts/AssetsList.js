var searchTimeout;

$(document).ready(function () {

    var hash = window.location.hash;
    if (hash != "") {
        hash = hash.replace("#", "");
        $("#FilterAssetCategory").val(hash);
    }

    filterAssets();

    $(document).on("click", ".delete", function () {

        var assestContainer = $(this).closest("li");
        var assetId = assestContainer.attr("id").split("_")[1];

        $("#DeleteAssetId").val(assetId);

        $("#DeleteAssetPromptHasPages").hide();
        $("#DeleteAssetPromptNoPages").hide();
        $("#DeleteAssetPromptLoadingPages").show();

        $(".asset-name").text("...");

        $.ajax({
            type: "POST",
            url: "/asset-details/" + assetId,
            success: function (data) {
                $(".asset-name").text(data.Filename);
            },
            error: function () { alert("Fail!"); }
        });

        $("#DeleteAssetPromptPages").html("");
        $.ajax({
            type: "POST",
            url: "/asset-pages/" + assetId,
            success: function (data) {
                if (data.length > 0) {
                    var template = $("#DeleteAssetPromptLinkedPage").clone();
                    template.removeAttr("id", "");

                    for (var i = 0; i < data.length; i++) {
                        var pageDom = template.clone();
                        pageDom.find("a").text(data[i].Name);
                        pageDom.find("a").attr("href", "/page/" + data[i].Id);
                        $("#DeleteAssetPromptPages").append(pageDom);
                    }
                    $("#DeleteAssetPromptHasPages").show();
                }
                else {
                    $("#DeleteAssetPromptNoPages").show();
                }

                $("#DeleteAssetPromptLoadingPages").hide();
            },
            error: function () { alert("Fail!"); }
        });
        $("#DeleteAssestPrompt").show();
    });

    $("#DeleteAssestPromptCancel").click(function () {
        $("#DeleteAssestPrompt").hide();
    });

    $("#DeleteAssestPromptOk").click(function () {
        var id = $("#DeleteAssetId").val();

        var assestContainer = $("#asset_" + id);

        $.ajax({
            type: "POST",
            url: "/delete-asset",
            data: { Id: id },
            success: function (data) {

            },
            error: function () { alert("Fail!"); }
        });

        $("#DeleteAssestPrompt").hide();
        assestContainer.slideUp(200, function () { assestContainer.remove(); });
    });

    $("#AssetView").change(function () {
        $("#AssetContainer").attr("class", $(this).val());
    });


    $("#FilterAssetCategory").change(function () {
        window.location.hash = $(this).val();
        filterAssets();
    });

    $("#Search").keyup(function () {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout("filterAssets()", 300);
    });
});

function filterAssets() {
    var categoryId = $("#FilterAssetCategory").val();

    var keywords = $("#Search").val();

    $("#FilterAssetCategory").attr("disabled", "disabled");
    $("#AssetContainer").addClass("loading");

    $.ajax({
        type: "POST",
        url: "/filtered-assets",
        data: { CategoryId: categoryId, Keywords: keywords, ImagesOnly: false },
        success: function (data) {
            var template = $("#AssetTemplate li");
            $(".assets").html("");
            for (var i = 0; i < data.length; i++) {
                var assetElement = template.clone()
                assetElement.attr("id", "asset_" + data[i].Id);

                var html = assetElement.html();

                html = html.replace("[assetId]", data[i].Id);
                html = html.replace("[assetId]", data[i].Id);
                html = html.replace("[assetId]", data[i].Id);
                html = html.replace("[assetId]", data[i].Id);
                html = html.replace("[assetId]", data[i].Id);

                html = html.replace("[Filename]", data[i].Fn);
                html = html.replace("[FriendlyFileSize]", data[i].Fs);
                html = html.replace("[Type]", data[i].T);
                html = html.replace("[DateCreated]", data[i].Dc);
                html = html.replace("[DateLastModified]", data[i].Dm);

                assetElement.html(html);
                $(".assets").append(assetElement);
            }

            $("#FilterAssetCategory").removeAttr("disabled");
            $("#AssetContainer").removeClass("loading");
        },
        error: function () { }
    });
}