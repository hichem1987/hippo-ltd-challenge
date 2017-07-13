/**
 * You should comment your code !
 **/

window.jQuery = require("jquery");
var bootstrap = require('bootstrap');
var datepicker = require('bootstrap-datepicker');
var $ = jQuery.noConflict();
require("./components/collapse");
require("./components/custom-select");
    var listdata ;
$(document).ready(function () {
    $.getJSON("data/data.json", function (data) {
        listdata = data['array'];
        $.each(data['array'], function (key, val) {
            var rank;
            rank = key + 1;
            $("<li data-id='" + key + "' class='element-li'><span class='list-name'><span>" + rank + "</span><span>" + val.firstname + "</span><span>" + val.lastname + "</span><span>" + val.datebirth + "</span><span>" + val.haircolor + "</span><span><button class='button-update btn-primary' type='button' >Update</button></span></li>").appendTo("ul.my-new-list");
        });
    })
//            .promise().done(function () {
////        alert("All was done");
//        jQuery('body').delegate('click', '.button-update', function () {
//            console.log('find');
//        });
//    });
//    jQuery('body').delegate('click', '.button-update', function () {
//        console.log('find');
//    });
});
$(function () {
    $('#datetimepicker10').datepicker({
        format: 'yyyy-mm-dd'
    });
    $('#datetimepicker11').datepicker({
        format: 'yyyy-mm-dd'
    });

    var HairColors = [
        "Black",
        "Brown",
        "Blond",
        "Red",
        "Gray",
        "White"
    ];


    $("#hairs").autocomplete({
        minLength: 1,
        source: HairColors
    });
    $("#hairsUpdate").autocomplete({
        minLength: 1,
        source: HairColors
    });

});
$('body').delegate('.button-update', 'click', function () {
    var id_element = $(this).closest('.element-li').data('id');
    $('#firstNameUpdate').val(listdata[id_element].firstname);
    $('#lastNameUpdate').val(listdata[id_element].lastname);
    $('#birthDateUpdate').val(listdata[id_element].datebirth);
    $('#hairsUpdate').val(listdata[id_element].haircolor);
    $('#modal-updateElement').modal('show');
}); 