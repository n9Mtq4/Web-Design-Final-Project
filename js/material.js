/**
 * Created by will on 5/29/15.
 */
var colours = [
    'F44336', /*0*/
    'E91E63', /*1*/
    '9C27B0', /*2*/
    '673AB7', /*3*/
    '3F51B5', /*4*/
    '2196F3', /*5*/
    '03A9F4', /*6*/
    '00BCD4', /*7*/
    '009688', /*8*/
    '4CAF50', /*9*/
    '8BC34A', /*10*/
    'CDDC39', /*11*/
    'FFEB3B', /*12*/
    'FFC107', /*13*/
    'FF9800', /*14*/
    'FF5722', /*15*/
    '795548', /*16*/
    '9E9E9E', /*17*/
    '607D8B'  /*18*/
];

function getRandomColour() {
    var i = Math.floor(Math.random() * colours.length);
    return '#' + colours[i];
}

function giveRandomColour(id) {
    var a = $(id);
    var index = 0;
    for (index = 0; index < a.length; ++index) {
        $(a[index]).css('color', getRandomColour());
    }
    delete a;
    delete index;
}

function giveRandomBackgroundColour(id) {
    var a = $(id);
    var index = 0;
    for (index = 0; index < a.length; ++index) {
        $(a[index]).css('background-color', getRandomColour());
    }
    delete a;
    delete index;
}

function materialUpdate() {
    var a = $('.randomcolour');
    var index;
    for (index = 0; index < a.length; ++index) {
        $(a[index]).css('color', getRandomColour());
    }
    $('.randomcolour').click(function() {
        $('.randomcolour').css('color', getRandomColour());
    });
    index = 0;
    a = $('.randombackgroundcolour');
    for (index = 0; index < a.length; ++index) {
        $(a[index]).css('background-color', getRandomColour());
    }
    index = 0;
    a = $('.givematerialcolour');
    for (index = 0; index < a.length; ++index) {
        $(a[index]).css('background-color', "#" + colours[parseInt($(a[index]).attr('data-colour'))]);
    }
    // delete a;
    // delete index;
}

$(document).ready(function() {
    materialUpdate();
});
