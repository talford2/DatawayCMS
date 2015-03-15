// Timothy Alford
// 16/9/2010
// custom designed drop down list
// Requires jQuery v1.4.3 or later
(function ($) {

    var methods = {
        setValues: function (values) {
            var selectElm = $(this);
            //var dropdownElm = selectElm.nextUntil(".dropdown-options").last().next();
            var dropdownElm = selectElm.closest(".dropdown");
            var optionsElm = selectElm.nextUntil(".dropdown-options").last().next();

            selectElm.empty();
            optionsElm.empty();
            for (var i = 0; i < values.length; i++) {
                var li = $("<li data-value=\"" + values[i].value + "\">" + values[i].title + "</li>");
                optionsElm.append(li);
                selectElm.append($("<option value=\"" + values[i].value + "\">" + values[i].title + "</option>"));
            }

            if (values.length > 0) {
                dropdownElm.find(".dropdown-current-value > span").text(values[0].title);
                dropdownElm.find("li:first").addClass("dropdown-options-focussed");
                selectElm.val(values[0].value);
            }
        },

        // Methods for setting the source of plugin dropdown, the URL will be hit and expects a json object in the format of
        // { title: "Blah", value: "Blah" }, the argObj contains all the arguments and method for example complete is a function that will be called
        // once the ajax has return and the download has been populated.
        setAjaxSource: function (url, argObj) {
            var selectElm = $(this);
            var dropdownElm = selectElm.parent();
            dropdownElm.addClass("loading");

            $.ajax({
                type: "GET",
                url: url,
                dataType: "json",
                //data: {
                //    ClassifiedId: id
                //},
                success: function (data) {

                    // This doesn't work... not sure why...
                    //methods.setSource(data, argObj);

                    var optionsElm = selectElm.nextUntil(".dropdown-options").last().next();
                    selectElm.empty();
                    optionsElm.empty();

                    var lis = new Array();

                    if (argObj != null) {
                        if (argObj.emptyOption != null) {
                            lis.push($("<li class=\"empty\" data-value=\"\">" + argObj.emptyOption + "</li>"));
                            selectElm.append($("<option value=\"\">" + argObj.emptyOption + "</option>"));
                        }
                    }

                    for (var i = 0; i < data.length; i++) {
                        var li = $("<li data-value=\"" + data[i].value + "\">" + data[i].title + "</li>");
                        lis.push(li);
                        selectElm.append($("<option value=\"" + data[i].value + "\">" + data[i].title + "</option>"));
                    }

                    // Add additional options
                    if (argObj != null) {
                        if (argObj.additionalOptions != null) {
                            for (var i = 0; i < argObj.additionalOptions.length; i++) {
                                lis.push($("<li data-value=\"" + argObj.additionalOptions[i].value + "\">" + argObj.additionalOptions[i].title + "</li>"));
                                selectElm.append($("<option value=\"" + argObj.additionalOptions[i].value + "\">" + argObj.additionalOptions[i].title + "</option>"));
                            }
                        }
                    }

                    optionsElm.append(lis);

                    if (argObj != null && argObj.emptyOption != null) {
                        dropdownElm.find(".dropdown-current-value > span").text(lis[0].text());
                        dropdownElm.find("li:first").addClass("dropdown-options-focussed");
                        selectElm.val("");
                    }
                    else if (data.length > 0) {
                        dropdownElm.find(".dropdown-current-value > span").text(data[0].title);
                        dropdownElm.find("li:first").addClass("dropdown-options-focussed");
                        selectElm.val(data[0].value);
                    }

                    dropdownElm.removeClass("loading");

                    if (argObj != null && argObj.complete != null) {
                        argObj.complete.apply(selectElm);
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    alert("An error occurred.");
                    dropdownElm.removeClass("loading");
                }
            });
        },

        setSource: function (data, argObj) {

            var selectElm = $(this);
            var dropdownElm = selectElm.parent();

            var optionsElm = selectElm.nextUntil(".dropdown-options").last().next();
            selectElm.empty();
            optionsElm.empty();

            var lis = new Array();

            if (argObj != null) {

                if (argObj.emptyOption != null) {
                    lis.push($("<li class=\"empty\" data-value=\"\">" + argObj.emptyOption + "</li>"));
                    selectElm.append($("<option value=\"\">" + argObj.emptyOption + "</option>"));
                }
            }

            for (var i = 0; i < data.length; i++) {
                var li = $("<li data-value=\"" + data[i].value + "\">" + data[i].title + "</li>");
                lis.push(li);
                selectElm.append($("<option value=\"" + data[i].value + "\">" + data[i].title + "</option>"));
            }
            // Add additional options
            if (argObj != null) {
                if (argObj.additionalOptions != null) {
                    for (var i = 0; i < argObj.additionalOptions.length; i++) {
                        lis.push($("<li data-value=\"" + argObj.additionalOptions[i].value + "\">" + argObj.additionalOptions[i].title + "</li>"));
                        selectElm.append($("<option value=\"" + argObj.additionalOptions[i].value + "\">" + argObj.additionalOptions[i].title + "</option>"));
                    }
                }
            }



            optionsElm.append(lis);

            if (argObj != null && argObj.emptyOption != null) {
                dropdownElm.find(".dropdown-current-value > span").text(lis[0].text());
                dropdownElm.find("li:first").addClass("dropdown-options-focussed");
                selectElm.val("");
            }
            else if (data.length > 0) {
                dropdownElm.find(".dropdown-current-value > span").text(data[0].title);
                dropdownElm.find("li:first").addClass("dropdown-options-focussed");
                selectElm.val(data[0].value);
            }

            if (argObj != null && argObj.complete != null) {
                argObj.complete.apply(selectElm);
            }
        },

        setValue: function (value) {
            //alert("Value = " + value)

            var selectElm = $(this);
            var dropdownElm = selectElm.parent();

            selectElm.val(value);
            selectOption(dropdownElm, value);
        },

        disable: function () {
            var selectElm = $(this);
            var dropdownElm = selectElm.closest(".dropdown");

            selectElm.prop('disabled', true);
            dropdownElm.addClass("disabled");
        },

        enable: function () {
            var selectElm = $(this);
            var dropdownElm = selectElm.closest(".dropdown");

            selectElm.prop('disabled', false);
            dropdownElm.removeClass("disabled");
        },

        hide: function () {
            var selectElm = $(this);
            var dropdownElm = selectElm.closest(".dropdown");

            dropdownElm.hide();
        },

        show: function () {
            var selectElm = $(this);
            var dropdownElm = selectElm.closest(".dropdown");

            dropdownElm.show();
        },

        get: function () {
            var selectElm = $(this);
            var dropdownElm = selectElm.closest(".dropdown");
            return dropdownElm;
        }
    };

    var selectOption = function (dropdown, value, settings) {


        var self = dropdown.find("select")

        var currentValue = self.val();

        self.val(value);

        var text = self.find("option:selected").text();
        dropdown.find(".dropdown-current-value > span").text(text);
        dropdown.find(".dropdown-options li").removeClass("dropdown-options-focussed");
        dropdown.find("li[data-value=\"" + value + "\"]").addClass("dropdown-options-focussed");

        if (currentValue != value) {
            if (settings != undefined && settings != null) {
                if (settings.change != null) {
                    settings.change.apply(self);
                }
            }
            self.change();
        }

        return false;
    }

    $.fn.dropdown = function (options) {
        var settings = $.extend({ change: null }, options);

        //var args = arguments;
        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function () {
            var self = $(this);

            if (methods[options]) {
                return methods[options].apply(self, args);
            }
            else {
                self.hide();

                // Outer span
                var outerDiv = self.wrap("<span class=\"dropdown\" tabindex=\"0\"></span>").parent();

                if (self.is(":disabled")) {
                    outerDiv.addClass("disabled");
                }

                // Current selected value
                outerDiv.append($("<span class=\"dropdown-current-value\"><span>" + self.find("option:selected").text() + "<span></span>"));

                // Dropdown list
                var ul = $("<ul class=\"dropdown-options\" style=\"display: none;\"></ul>");


                ul.on("click", "li", function (e) {
                    var selectedLi = $(this);
                    var selectedValue = selectedLi.attr("data-value");
                    if (selectedValue == undefined) {
                        selectedValue = selectedLi.text();
                    }
                    selectOption(outerDiv, selectedValue, settings);
                    hideOptions(outerDiv);
                    return false;
                });

                // Better way of doing focusout (works in IE)
                $(document).on("click", function (e) {

                    var container = outerDiv;
                    if (!container.is(e.target) // if the target of the click isn't the container...
                        && container.has(e.target).length === 0) // ... nor a descendant of the container
                    {
                        ul.hide();
                        hideOptions(outerDiv);
                    }
                });

                self.find("option").each(function () {
                    var li = $("<li data-value=\"" + $(this).val() + "\">" + $(this).text() + "</li>");
                    var selectControl = $(this).closest(".dropdown").find("select");
                    if ($(this).val() == selectControl.val()) {
                        li.addClass("dropdown-options-focussed");
                    }
                    ul.append(li);
                });

                outerDiv.append(ul);

                outerDiv.keydown(function (e) {
                    var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;

                    //32 space
                    //27 escape

                    var isOptionsOpen = outerDiv.find(".dropdown-options").is(":visible");

                    //alert("vis = " + isOptionsOpen);
                    var value = outerDiv.find(".dropdown-options-focussed").attr("data-value");

                    switch (key) {
                        case 13:
                            if (isOptionsOpen) {
                                selectOption(outerDiv, value, settings);
                                hideOptions(outerDiv);
                            }
                            else {
                                selectOption(outerDiv, outerDiv.find("select").val(), settings);
                                showOptions(outerDiv);
                            }
                            break;
                        case 27:
                            hideOptions(outerDiv);
                            break;
                            // Up                                      
                        case 38:
                            var selected = outerDiv.find(".dropdown-options-focussed");
                            var prev = selected.prev();
                            if (prev != null && prev.length > 0) {
                                selected.removeClass("dropdown-options-focussed");
                                prev.addClass("dropdown-options-focussed");
                                value = prev.attr("data-value");
                            }
                            if (!isOptionsOpen) {
                                selectOption(outerDiv, value, settings);
                            }
                            e.preventDefault();
                            break;
                            // Down                                       
                        case 40:
                            var selected = outerDiv.find(".dropdown-options-focussed");
                            var next = selected.next();
                            if (next != null && next.length > 0) {
                                selected.removeClass("dropdown-options-focussed");
                                next.addClass("dropdown-options-focussed");
                                value = next.attr("data-value");
                            }
                            if (!isOptionsOpen) {
                                selectOption(outerDiv, value, settings);
                            }
                            e.preventDefault();
                            break;
                    }
                });

                self.parent().click(function () {
                    showOptions($(this));
                });

                var showOptions = function (dropdown) {
                    if (!self.closest(".dropdown").hasClass("disabled")) {
                        dropdown.find(".dropdown-options").slideDown(100);
                        dropdown.addClass("show-menu");
                    }
                };

                var hideOptions = function (dropdown) {
                    dropdown.find(".dropdown-options").hide();
                    dropdown.removeClass("show-menu");
                }
            }
        });
    };
})(jQuery);