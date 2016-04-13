/**
 * Created by will on 5/29/15.
 */

var includedUrls = [];

$(document).ready(function() {
    
    invalidatePage();
    
    /*navbar tab support*/
    $(".navbartab").click(function (event) {
        gotoData(this);
    });
    
});

$(window).on("popstate", function(e) {
    invalidatePage();
});

/*FIXME: doesn't work*/
function css() {
    for (var i = 0; i < arguments.length; i++) {
        /*http://stackoverflow.com/a/26514362*/
        var css = $("<link>", {
            "rel": "stylesheet",
            "type": "text/css",
            "href": "css/" + arguments[i] + ".css"
        });
        // document.getElementsByTagName("head")[0].appendChild(css);
        $("head").append(css);
    }
}

function invalidatePage() {
    var page = getAdjCurrentPage();
    //loadContents("html/" + page + "c.html", $(".contents"));
    loadHtmlPage(page, $(".contents"));
    //TODO: doesn't work when going back from external website
    var selected = 0; // default
    var tabs = $("paper-tab");
    for (var i = 0; i < tabs.length; i++) {
        var tab = tabs[i];
        if ($(tab).data("goto") == page.toLowerCase()) {
            selected = i;
            break;
        }
    }
    try {
        Polymer.dom(document).querySelector("paper-tabs").select(selected);
    }catch (e) {} // ignore
}

function getAdjCurrentPage() {
    var page = getCurrentPage();
    if (page.trim() == "") page = "index";
    return page;
}

function gotoData(elem) {
    goto($(elem).data("goto"));
}

function importElement(element, folder) {
    var url = folder + "/" + element + "/" + element + ".html";
    var included = typeof includedUrls.indexOf(url) === 'undefined';
    if (included) return;
    includedUrls.push(url);
    var link = document.createElement('link');
    link.setAttribute('rel', 'import');
    link.setAttribute('href', url);
    /*link.onload = function() {};*/
    document.body.appendChild(link);
}

function requires() {
    for (var i = 0; i < arguments.length; i++) {
        importElement(arguments[i], "components");
    }
}

function requiresc() {
    for (var i = 0; i < arguments.length; i++) {
        var args = arguments[i].split("/");
        importElement(args[1], args[0]);
    }
}


function goto(str) {
    // window.location.search = jQuery.query.set("page", str);
    window.history.pushState({"html":document.innerHTML,"pageTitle":document.title},"", "index.html?page=" + str);
    invalidatePage();
}

function setTitle(str) {
    document.title = str;
}

function loadHtmlPage(page, location) {
    page = formatPage(page);
    loadContents("html/" + page + "c.html", location);
}

function loadHtmlPageToDefault(page) {
    loadHtmlPage(page, $(".contents"));
}

function loadContents(url, location) {
    $.ajax({
        url: url,
        data: {
        },
        success: function(data) {
            var html = removeCorsNAV(data);
            //$(".contents").html(html);
            location.html(html);
        },
        error: function(data) {
            if (getCurrentPage() == "404") {
                $("body".html("Sorry, something has gone horribly wrong!"))
            }else {
                goto("404");
            }
        }
    });
}

function removeCorsNAV(str) {
    // return str.replace("Access-Control-Allow-Origin: *", "");
    return str;
}

function getParameterByName(name) {
    //http://stackoverflow.com/a/901144
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function contains(str, str1) {
    return str.indexOf(str1) > -1;
}

function formatPage(str) {
    str1 = str.replaceAll(".", "/");
    return str1;
}

function getCurrentPage() {
    var url = window.location.href;
    if (contains(url, "?") && contains(url, "page=")) {
        return getParameterByName("page");
    }else {
        var dirList = url.split("/");
        var end = dirList[dirList.length - 1];
        var page = end.split(".")[0];
        return page;
    }
}
