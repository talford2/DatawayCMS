var AssetSelector = {
    assetCategorySearchTimeout: null,
    assetCategoryId: null,
    thumbSize: 200,

    Init: function () {
        // Bring up asset selection 
        $("#AssetsPane").mCustomScrollbar();

        $(document).on("click", ".select-asset", function () {
            if ($(this).hasClass("image")) {
                $("#AssetSelectorAssetHeader").text("Select an image");
                $("#AssetSelectorImagesOnly").val("true");
            }
            else {
                $("#AssetSelectorAssetHeader").text("Select a file");
                $("#AssetSelectorImagesOnly").val("false");
            }
            var component = $(this).closest(".component");
            var componentId = component.attr("id");
            var selectedImgId = component.find(".asset-value").val();
            AssetSelector.ShowAssetSelector(componentId, selectedImgId);
        });

        $(document).on("click", ".crop-image", function () {
            var component = $(this).closest(".component");
            var componentId = component.attr("id");

            var selectedImgId = component.find(".asset-value").val();

            ShowCropImage(componentId, selectedImgId);
        });

        $(document).on("click", "#AssetSelectorCategoryId li", function () {
            //alert("???");
            //alert("Selected! " + $(this).attr("data-value"));

            $("#AssetSelectorCategoryId li").removeClass("selected");
            $(this).addClass("selected");

            AssetSelector.assetCategoryId = $(this).attr("data-value");
            AssetSelector.FilterAssets();
        });



        //---------------------------------------------------------------------------------
        $("#AssetDropArea").on("dragover", function (event) {
            event.preventDefault();
            event.stopPropagation();
            if (!$(this).hasClass("dragging")) {
                $(this).addClass('dragging');
                console.log("on");
            }
        });

        $("#AssetDropArea").on("dragleave", function (event) {
            event.preventDefault();
            event.stopPropagation();

            if ($(this).hasClass("dragging")) {
                $(this).removeClass('dragging');
                console.log("off");
            }
        });

        $("#AssetDropArea").on("drop", function (event) {
            event.preventDefault();
            event.stopPropagation();
            var files = event.originalEvent.dataTransfer.files;


            var catId = $("#AssetSelectorCategoryId li.selected").data("value");


            if (files.length > 0) {

                $("#AssetSelectorUploaderProgress").addClass("show");
                $("#AssetSelectorUploaderProgress").text("Starting to upload " + files.length + " files");


                var uploadedFiles = 0;

                //self.FileDropUpload(files, $("#folder-id").val());
                console.log(files.length + " Files in " + catId);

                for (var i = 0; i < files.length; i++) {

                    var formData = new FormData();
                    formData.append("AssetCategoryId", catId);
                    formData.append("File", files[i]);
                    var filename = files[i].name;


                    //-------------------------------------------
                    var jqXhr = $.ajax({
                        xhr: function () {
                            var xhr = $.ajaxSettings.xhr();
                            if (xhr.upload) {
                                xhr.upload.addEventListener(
                                    "progress",
                                    function (event) {
                                        var percent = 0;
                                        var position = event.loaded || event.position;
                                        var total = event.total;
                                        if (event.lengthComputable) {
                                            percent = Math.ceil(position / total * 100);
                                            $("#AssetSelectorUploaderProgress").text(uploadedFiles + " / " + files.length + "(" + percent + "%)");
                                        }
                                    },
                                    false
                                );
                            }
                            return xhr;
                        },
                        url: "/add-asset",
                        type: "POST",
                        contentType: false,
                        processData: false,
                        cache: false,
                        data: formData,
                        success: function (data) {
                            uploadedFiles++;
                            $("#AssetSelectorUploaderProgress").text(uploadedFiles + " / " + files.length + " done.");
                            if (uploadedFiles == files.length) {
                                $("#AssetSelectorUploaderProgress").text("All Files Uploaded");
                                $("#AssetSelectorUploaderProgress").removeClass("show");
                            }

                            AssetSelector.FilterAssets();
                        },
                        error: function (data) {
                            isSuccess = false;
                        }
                    });

                    //        .done(
                    //    function () {
                    //        if (successCount == uploadedFilesCount) {
                    //            shared.HideAllModals();
                    //            window.location.reload();
                    //        }
                    //    }
                    //).error(
                    //    function () {
                    //        shared.DisplayAjaxError("File upload failed.");
                    //    }
                    //);

                    //-------------------------------------------

                }
            }

            $(this).removeClass('dragging');

            //alert("Dropped!");
        });
        //---------------------------------------------------------------------------------




        //$("#AssetDropArea").on("drop", function (event) {
        //    event.preventDefault();
        //    event.stopPropagation();
        //    alert("Dropped!");
        //});

        // Confirm an asset selection
        //$("#AssetSelectorOk").click(function () {
        $(document).on("click", "#AssetSelectorOk", function () {
            var assetId = $("#AssetSelectorAssetId").val();
            $("#" + $("#AssetSelectorField").val()).find(".asset-value").val(assetId);

            if (assetId == "") {
                $("#" + $("#AssetSelectorField").val()).find(".image-thumb").attr("style", "background-image:url(/Images/noImageThumb.png)");
            }
            else {
                $.ajax({
                    type: "POST",
                    url: "/asset-details/" + assetId,
                    success: function (data) {
                        $("#" + $("#AssetSelectorField").val()).find(".image-thumb").attr("style", "background-image:url(/asset-thumb/" + $("#AssetSelectorAssetId").val() + "?w=" + AssetSelector.thumbSize + "&h=" + AssetSelector.thumbSize + "&dm=" + data.DateModifiedTicks + ")");
                    },
                    error: function () { alert("Fail! ------"); }
                });
            }
            $("#AssetSelector").hide();
        });

        // Select an asset
        $(document).on("click", "#AssetSelectorAssetThumbs li", function () {
            if ($(this).attr("id") == undefined) {
                $("#AssetSelectorAssetThumbs li").removeClass("selected");
                $(this).addClass("selected");
                $("#AssetSelectorAssetId").val("");
            }
            else {
                var id = $(this).attr("id").split("_")[1];
                $("#AssetSelectorAssetThumbs li").removeClass("selected");
                $(this).addClass("selected");
                $("#AssetSelectorAssetId").val(id);
            }
        });

        $(document).on("mouseout", "#AssetSelectorAssetThumbs li img", function (e) {
            //$("#AssetSelectorDetails").offset({ left: 0, top: 0 });
            $("#AssetSelectorDetails").hide();
        });


        $("#AssetSelectorCancel").click(function () {
            $("#AssetSelector").hide();
        });


        $("#AssetSelectorCategoryId").change(function () {
            AssetSelector.FilterAssets();
        });


        $("#AssetSelectorKeywords").keyup(function () {
            clearTimeout(AssetSelector.assetCategorySearchTimeout);
            AssetSelector.assetCategorySearchTimeout = setTimeout(AssetSelector.FilterAssets, 300);
        });
    },

    FilterAssets: function () {
        //alert("le pop!");

        var categoryId = AssetSelector.assetCategoryId; //$("#AssetSelectorCategoryId").val();
        var keywords = $("#AssetSelectorKeywords").val();

        $("#AssetSelectorCategoryId").attr("disabled", "disabled");

        var value = $("#AssetSelectorAssetId").val();

        $("#AssetSelectorAssetThumbs").addClass("loading");

        $.ajax({
            type: "POST",
            url: "/filtered-assets",
            //data: { ImagesOnly: },
            data: { CategoryId: categoryId, Keywords: keywords, ImagesOnly: $("#AssetSelectorImagesOnly").val() },
            success: function (data) {
                $("#AssetSelectorAssetThumbs").html("");
                var html = "<li><img src=\"/Images/noImageThumb.png\" /></li>";
                for (var i = 0; i < data.length; i++) {
                    html += "<li id=\"AssetSelectorAssetThumb_" + data[i].Id + "\" title=\"" + data[i].Fn + "\"><img src=\"/asset-thumb/" + data[i].Id + "?dm=" + data[i].Dm + "\" /></li>";
                }
                $("#AssetSelectorAssetThumbs").html(html);
                $("#AssetSelectorAssetThumbs").show();
                $("#AssetSelectorLoader").hide();
                $("#AssetSelectorAssetThumb_" + value).addClass("selected");

                $("#AssetSelectorCategoryId").removeAttr("disabled");
                $("#AssetSelectorAssetThumbs").removeClass("loading");

                $("#AssetsPane").mCustomScrollbar("update");


                // Fade in after loading
                $("#AssetSelectorAssetThumbs img").each(function () {
                    $(this).hide();
                    $(this).addClass("loading");

                    if (this.complete) {
                        $(this).show();
                        $(this).removeClass("loading");
                    }
                    else {
                        $(this).load(function () {
                            $(this).fadeIn(300);
                            $(this).removeClass("loading");
                        });
                    }
                });
            },
            error: function () { alert("Fail!"); }
        });
    },

    ShowAssetSelector: function (fieldId, value) {
        $("#AssetSelectorLoader").show();
        $("#AssetSelectorAssetThumbs").hide();

        $("#AssetSelector").show();
        $("#AssetSelectorField").val(fieldId);
        $("#AssetSelectorAssetId").val(value);
        $("#AssetSelectorAssetThumbs li").removeClass("selected");
        $("#AssetSelectorAssetThumb_" + value).addClass("selected");

        //$("#AssetSelectorCategoryId").attr("disabled", "disabled");

        AssetSelector.assetCategoryId = null;

        $.ajax({
            type: "POST",
            url: "/get-asset-categories",
            success: function (data) {
                $("#AssetSelectorAssetThumbs").html("");
                $("#AssetSelectorCategoryId").html("");
                $("#AssetSelectorCategoryId").append("<li class='selected' data-value=\"\">All Categories</li>");
                for (var i = 0; i < data.length; i++) {
                    $("#AssetSelectorCategoryId").append("<li data-value=\"" + data[i].Id + "\">" + data[i].Name + "</li>");
                }

                if (value != null && value != "") {
                    $.ajax({
                        type: "POST",
                        url: "/asset-details/" + value,
                        success: function (data) {
                            if (data.CategoryId != null) {
                                //$("#AssetSelectorCategoryId").val(data.CategoryId);
                                AssetSelector.assetCategoryId = data.CategoryId;
                                $("#AssetSelectorCategoryId li").removeClass("selected");
                                $("#AssetSelectorCategoryId [data-value='" + data.CategoryId + "']").addClass("selected");
                            }
                            else {
                                //$("#AssetSelectorCategoryId").val("");
                            }

                            //console.log(data);
                            //alert("---> " + data.CategoryId + " <---");

                            AssetSelector.FilterAssets();
                        },
                        error: function () { alert("Fail! ------"); }
                    });
                }
                else {
                    AssetSelector.FilterAssets();
                    //$("#AssetSelectorCategoryId").removeAttr("disabled");
                }
            }
        });
    }
};

$(function () {
    AssetSelector.Init();
});