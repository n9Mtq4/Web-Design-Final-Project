/* (c) Copyright 2013-2015 Will (n9Mtq4) Bresnahan */
/* Will Bresnahan's javascript search library */
/* Adapted for use at n9Mtq4.com*/

var search = {
    htmlOutput: '',
    open: false,
    firstTime: true,
    htmlOutputPrefix: '',
    htmlOutputSuffix: '',
    searchInputFieldID: 'field',
    outputDivID: 'searchResultSpace',
    writeTemplate: '',
    startSearch: function() {
        var inputField = document.getElementById(search.searchInputFieldID);
        if (inputField.value.trim() == "") {
            inputField.value = "a b c d e f g h i j k l m n o p q r s t u v w x y z";
        }
        var result = search.searchAlg(inputField.value);
        search.sortArray(result);
        search.writeResult(result);
    },
    reset: function() {
        $('#field').val("");
        search.clearResults();
    },
    clearResults: function() {
        $("#" + search.outputDivID).fadeOut();
        document.getElementById(search.outputDivID).innerHTML = '';
    },
    writeResult: function(inputArray) {
        var count01 = 0;
        var space = document.getElementById(search.outputDivID);
        htmlOutput = '';
        htmlOutput.concat(search.htmlOutputPrefix);
        while (count01 < inputArray.length) {
            /*parsing input*/
            var mainIndexLocation = inputArray[count01][0];
            var placement = inputArray[count01][1];
            var title = searchDatabase[mainIndexLocation][0];
            var desc = searchDatabase[mainIndexLocation][1];
            var href = searchDatabase[mainIndexLocation][3];
            if (containsStr(href, "g:")) {
                href = href.replaceAll("g:", "javascript:goto('") + "');"
            }
            var searchResultHtml = search.writeTemplate;
            searchResultHtml = searchResultHtml.replaceAll("$TITLE", title);
            searchResultHtml = searchResultHtml.replaceAll("$DESC", desc);
            searchResultHtml = searchResultHtml.replaceAll("$HREF", href);
            htmlOutput = htmlOutput.concat(searchResultHtml);
            count01++;
        }
        htmlOutput.concat(search.htmlOutputSuffix);
        space.innerHTML = htmlOutput;
        search.showResults();
    },
    searchAlg: function(keyWord) {
        /* algorithm for searching the array */
        var count = 0;
        var intArray = new Array();
        while (count < searchDatabase.length) {
            var keywordCount = 0;
            var comp = searchDatabase[count][2].split(", ");
            var keyWords = keyWord.split(" ");
            count1 = 0;
            while (count1 < comp.length) {
                /*comp[count1];*/
                var count2 = 0;
                while (count2 < keyWords.length) {
                    if (comp[count1].indexOf(keyWords[count2].toLowerCase()) != -1 || keyWords[count2].indexOf(comp[count1].toLowerCase()) != -1) {
                        keywordCount++;
                    }
                    count2++;
                }
                count1++;
            }
            if (keywordCount > 0) {
                intArray.push([count, keywordCount]);
            }
            count++;
        }
        if (intArray.length == 0) {
            intArray.push([0, 1]);
        }
        return intArray;
    },
    sortArray: function(array) {
        array.sort(function (a, b) {
            return b[1] - a[1];
        });
    },
    showResults: function() {
        $("#" + search.outputDivID).fadeIn();
    },
    openSearch: function() {
        $('#field').fadeIn(500);
        $('#clearbutton').fadeIn(500);
        $('#field').focus();
    },
    closeSearch: function() {
        $('#field').fadeOut(500);
        $('#clearbutton').fadeOut(500);
    },
    toggleSearch: function() {
        if (search.open) {
            search.closeSearch();
        }else {
            search.openSearch();
        }
        search.open = !search.open;
    },
    clearBoth: function() {
        search.clearResults();
        $('#field').val('');
    },
    searchButton: function() {
        if (search.firstTime) {
            search.ajaxit();
            search.firstTime = false;
            //TODO: DONE remove search not indexed notification
            // alert("Pages haven't been indexed yet, but\nfeel free to play around with searching\nthe examples.\n-Will Bresnahan");
        }
        if ($('#field').val().trim() == "") {
            search.toggleSearch();
        }else if (search.open) {
            search.startSearch();
        }else if (!search.open) {
            search.toggleSearch();
        }
    },
    ajaxit: function() {
        search.firstTime = false;
        //TODO: dependencies
        requires('n9mtq4-searchcard');
        $.ajax({
            //TODO: relative link vs global link
            //url: "http://n9mtq4.com/js/searchDatabase.jsp",
            url: "js/searchDatabase.txt",
            data: {
            },
            success: function(data) {
                //TODO: console.log
                console.log("Loaded search database");
                eval("searchDatabase = " + removeCors(data));
            },
            error: function(data) {
                /*try again*/
                search.ajaxit();
            }
        });
        $.ajax({
            //TODO: relative link vs global link
            url: "html/searchTemplate.html",
            data: {
            },
            success: function(data) {
                //TODO: console.log
                console.log("Loaded search template");
                search.writeTemplate = removeCors(data);
            },
            error: function(data) {
                /*try again*/
                search.ajaxit();
            }
        });
        $.ajax({
            //TODO: relative link vs global link
            url: "js/searchRequirements.js",
            data: {
            },
            success: function(data) {
                //TODO: console.log
                console.log("Loaded search template requirements");
                eval(removeCors(data));
            },
            error: function(data) {
                /*try again*/
                //TODO: this is a bad thing
                //Commented for now
                alert("Error loading the search database. Reload the page and try again");
                // search.ajaxit();
            }
        })
    }
};

function removeCors(str) {
    // return str.replace("Access-Control-Allow-Origin: *", "");
    return str;
}
function containsStr(str, str1) {
    return str.indexOf(str1) > -1;
}

$(document).ready(function() {
    /* Back button support */
    /*return;*/
    String.prototype.replaceAll = function(search, replace) {
        if (replace === undefined) {
            return this.toString();
        }
        return this.split(search).join(replace);
    };
    
    $('#field').hide();
    $('#clearbutton').hide();
    if (($("#field").val()).trim() != "") {
        search.ajaxit();
        setTimeout(function() {
            search.startSearch();
            search.openSearch();
        }, 100);

    }
    
    $('#searchbutton').click(search.searchButton);
    $('#clearbutton').click(search.clearBoth);

    $("#field").keyup(function (e) {
        if (e.keyCode == 13) {
            search.startSearch();
        }
    });
    
});
