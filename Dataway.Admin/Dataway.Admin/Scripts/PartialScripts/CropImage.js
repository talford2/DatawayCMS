var grabX = 0;
var grabY = 0;

var relX = 0;
var relY = 0;

var cropperX = 0;
var cropperY = 0;

var previewWidth = 0;
var previewHeight = 0;

var mode = null;

var maxPreviewWidth = 737;
var maxPreviewHeight = 400;

var cropBorderWidth = 1;

var scale = 1;

var initCropperX = 0;
var initCropperY = 0;
var initCropperWidth = 0;
var initCropperHeight = 0;

$(document).ready(function () {
    $("#CropImageCancel").click(function () {
        $("#CropImage").hide();
    });

    $("#CropImageOk").click(function () {
        var cropStr = "";
        cropStr += $("#CropImageX").val() + ",";
        cropStr += $("#CropImageY").val() + ",";
        cropStr += $("#CropImageWidth").val() + ",";
        cropStr += $("#CropImageHeight").val();

        $("#" + $("#CropImageField").val()).find(".crop").val(cropStr);

        $("#CropImage").hide();
    });

    $(document).mouseup(function () {
        mode = null;
        $("#CropImageWorkArea").css("cursor", "");
    });

    $("#CropImageCropper").mousedown(function (event) {

        var cropperWidth = parseInt($("#CropImageCropper").width());
        var cropperHeight = parseInt($("#CropImageCropper").height());

        if (previewWidth == cropperWidth && previewHeight == cropperHeight) {
            mode = "draw";
            grabX = relX;
            grabY = relY;
        }
        else {
            mode = "drag";
            grabX = relX - cropperX;
            grabY = relY - cropperY;
        }

        console.log("GRAB::: " + grabX + " , " + grabY);
        event.stopPropagation();
    });

    // Draing handles
    $("#CropImageDragSE").mousedown(function (event) {
        mode = "resize";
        grabX = cropperX;
        grabY = cropperY;
        event.stopPropagation();

        $("#CropImageWorkArea").css("cursor", "se-resize");
    });
    $("#CropImageDragSW").mousedown(function (event) {
        mode = "resize";
        grabX = cropperX + parseInt($("#CropImageCropper").width());
        grabY = cropperY;
        event.stopPropagation();

        $("#CropImageWorkArea").css("cursor", "sw-resize");
    });
    $("#CropImageDragNE").mousedown(function (event) {
        mode = "resize";
        grabX = cropperX;
        grabY = cropperY + parseInt($("#CropImageCropper").height());
        event.stopPropagation();

        $("#CropImageWorkArea").css("cursor", "ne-resize");
    });
    $("#CropImageDragNW").mousedown(function (event) {
        mode = "resize";
        grabX = cropperX + parseInt($("#CropImageCropper").width());
        grabY = cropperY + parseInt($("#CropImageCropper").height());
        event.stopPropagation();

        $("#CropImageWorkArea").css("cursor", "nw-resize");
    });

    $("#CropImageDragE").mousedown(function (event) {
        mode = "resize-e";
        initCropperX = cropperX;
        initCropperY = cropperY;
        initCropperWidth = parseInt($("#CropImageCropper").width());
        initCropperHeight = parseInt($("#CropImageCropper").height());
        event.stopPropagation();
        $("#CropImageWorkArea").css("cursor", "e-resize");
    });

    $("#CropImageDragW").mousedown(function (event) {
        mode = "resize-w";
        initCropperX = cropperX;
        initCropperY = cropperY;
        initCropperWidth = parseInt($("#CropImageCropper").width());
        initCropperHeight = parseInt($("#CropImageCropper").height());
        event.stopPropagation();
        $("#CropImageWorkArea").css("cursor", "w-resize");
    });

    $("#CropImageDragN").mousedown(function (event) {
        mode = "resize-n";
        initCropperX = cropperX;
        initCropperY = cropperY;
        initCropperWidth = parseInt($("#CropImageCropper").width());
        initCropperHeight = parseInt($("#CropImageCropper").height());
        event.stopPropagation();
        $("#CropImageWorkArea").css("cursor", "n-resize");
    });

    $("#CropImageDragS").mousedown(function (event) {
        mode = "resize-s";
        initCropperX = cropperX;
        initCropperY = cropperY;
        initCropperWidth = parseInt($("#CropImageCropper").width());
        initCropperHeight = parseInt($("#CropImageCropper").height());
        event.stopPropagation();
        $("#CropImageWorkArea").css("cursor", "s-resize");
    });

    $(document).mousemove(function (event) {
        relX = event.pageX - $("#CropImageCropArea").offset().left;
        relY = event.pageY - $("#CropImageCropArea").offset().top;

        $("#Pos").val("(" + relX + "," + relY + ")");

        cropperX = $("#CropImageCropper").offset().left - $("#CropImageCropArea").offset().left;
        cropperY = $("#CropImageCropper").offset().top - $("#CropImageCropArea").offset().top;

        var maxWidth = parseInt($("#CropImageCropArea").width());
        var maxHeight = parseInt($("#CropImageCropArea").height());

        var cropWidth = $("#CropImageCropper").width();
        var cropHeight = $("#CropImageCropper").height();

        var scale = $("#CropImageScale").val();

        if (mode != null) {
            clearSelection();
        }

        if (mode == "drag") {

            var cropperWidth = $("#CropImageCropper").width();
            var cropperHeight = $("#CropImageCropper").height();

            var x1 = relX - grabX;
            var y1 = relY - grabY;

            if (x1 < 0) {
                x1 = 0;
            }
            if (y1 < 0) {
                y1 = 0;
            }

            if (x1 + cropperWidth > previewWidth) {
                x1 = previewWidth - cropperWidth;
            }

            if (y1 + cropperHeight > previewHeight) {
                y1 = previewHeight - cropperHeight;
            }

            var x2 = x1 + cropperWidth;
            var y2 = y1 + cropperHeight;

            renderCropper(x1, y1, x2, y2);
        }
        else if (mode == "resize") {

            var x1 = grabX;
            var y1 = grabY;
            var x2 = relX;
            var y2 = relY;
            renderCropper(x1, y1, x2, y2);
        }
        else if (mode == "resize-n") {
            var x1 = initCropperX;
            var y1 = relY;
            var x2 = initCropperX + initCropperWidth;
            var y2 = initCropperHeight + initCropperY;
            renderCropper(x1, y1, x2, y2);
        }
        else if (mode == "resize-e") {
            var x1 = initCropperX;
            var y1 = initCropperY;
            var x2 = relX;
            var y2 = initCropperHeight + initCropperY;
            renderCropper(x1, y1, x2, y2);
        }
        else if (mode == "resize-w") {
            var x1 = relX;
            var y1 = initCropperY;
            var x2 = initCropperX + initCropperWidth;
            var y2 = initCropperY + initCropperHeight;
            renderCropper(x1, y1, x2, y2);
        }
        else if (mode == "resize-s") {
            var x1 = initCropperX;
            var y1 = initCropperY;
            var x2 = initCropperX + initCropperWidth;
            var y2 = relY;
            renderCropper(x1, y1, x2, y2);
        }
        else if (mode == "draw") {

            var x1 = grabX;
            var y1 = grabY;
            var x2 = relX;
            var y2 = relY;
            renderCropper(x1, y1, x2, y2);
        }
    });

    $(".crop-image-update").change(function () {
        var x1 = scale * parseFloat($("#CropImageX").val());
        var y1 = scale * parseFloat($("#CropImageY").val());
        var x2 = scale * parseFloat($("#CropImageWidth").val()) + x1;
        var y2 = scale * parseFloat($("#CropImageHeight").val()) + y1;
        console.log("sclae = "+ scale+" (" + x1 + "," + y1 + ")(" + x2 + "," + y2 + ")");
        renderCropper(x1, y1, x2, y2);
    });
});


function clearSelection() {
    if (document.selection) {
        document.selection.empty();
    } else if (window.getSelection) {
        window.getSelection().removeAllRanges();
    }
}

function ShowCropImage(fieldId, assetId) {
    $("#CropImageWorkArea").hide();
    $("#CropImageLoader").show();

    $("#CropImageAssetId").val(assetId);

    var setWidth = maxPreviewWidth;
    var setHeight = maxPreviewHeight;

    $.ajax({
        type: "POST",
        url: "/asset-details/" + assetId,
        success: function (data) {
            var width = data.Width;
            var height = data.Height;

            setHeight = height;

            scale = 1;
            if (width > setWidth) {
                scale = parseFloat(setWidth) / parseFloat(width);

                setWidth = maxPreviewWidth;
                setHeight = setWidth * (height / width);
            }
            else {
                setWidth = width;
            }

            if (setHeight > maxPreviewHeight) {
                setHeight = maxPreviewHeight;
                scale = parseFloat(setHeight) / parseFloat(height);
                setWidth = width * scale;
            }

            previewWidth = parseInt(setWidth);
            previewHeight = parseInt(setHeight);

            $("#CropImageCropArea").css("background-image", "url(/image/" + assetId + "?w=" + previewWidth + ")");
            $("#CropImageCropper").css("background-image", "url(/image/" + assetId + "?w=" + previewWidth + ")");

            $("#CropImageCropArea").width(previewWidth);
            $("#CropImageCropArea").height(previewHeight);

            var x1 = 0;
            var y1 = 0;
            var x2 = previewWidth;
            var y2 = previewHeight;

            $("#CropImageField").val(fieldId);
            var crop = $("#" + fieldId).find(".crop").val();
            var cropBits = crop.split(",");

            $("#CropImageX").val("0");
            $("#CropImageY").val("0");
            $("#CropImageWidth").val("0");
            $("#CropImageHeight").val("0");

            if (cropBits.length == 4) {
                $("#CropImageX").val(cropBits[0]);
                $("#CropImageY").val(cropBits[1]);
                $("#CropImageWidth").val(parseInt(cropBits[2]) + parseInt(cropBits[0]));
                $("#CropImageHeight").val(parseInt(cropBits[3]) + parseInt(cropBits[1]));

                x1 = parseInt($("#CropImageX").val() * scale);
                y1 = parseInt($("#CropImageY").val() * scale);
                x2 = parseInt($("#CropImageWidth").val() * scale);
                y2 = parseInt($("#CropImageHeight").val() * scale);
            }

            console.log("DIM ::: " + previewWidth + " x " + previewHeight);

            renderCropper(x1, y1, x2, y2);

            $("#CropImageWorkArea").show();
            $("#CropImageLoader").hide();

            $("#CropImageCropArea").show();
        }
    });

    $("#CropImage").show();
}

function renderCropper(x1, y1, x2, y2) {
    console.log("(" + x1 + ", " + y1 + ") (" + x2 + ", " + y2 + ")");

    var left = x1;
    var right = x2;

    if (x2 < x1) {
        left = x2;
        right = x1;
    }

    var top = y1;
    var bottom = y2;
    if (y2 < y1) {
        top = y2;
        bottom = y1;
    }

    if (left < 0) {
        left = 0;
    }
    if (top < 0) {
        top = 0;
    }
    if (bottom > previewHeight) {
        bottom = previewHeight;
    }
    if (right > previewWidth) {
        right = previewWidth;
    }

    top = parseInt(top);
    bottom = parseInt(bottom);
    left = parseInt(left);
    right = parseInt(right);

    var width = parseInt(right - left);
    var height = parseInt(bottom - top);

    console.log("CROPPER ::: " + left + ", " + top + ", " + right + ", " + bottom);

    $("#CropImageCropper").css("left", left + "px");
    $("#CropImageCropper").css("top", top + "px");

    $("#CropImageCropper").width(width);
    $("#CropImageCropper").height(height);

    $("#CropImageCropper").css("background-position", (0 - left) + "px " + (0 - top) + "px");

    $("#CropImageX").val(parseInt(left / scale));
    $("#CropImageY").val(parseInt(top / scale));
    $("#CropImageWidth").val(parseInt(width / scale));
    $("#CropImageHeight").val(parseInt(height / scale));
}