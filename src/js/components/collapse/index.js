/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//function collapse button for more shops
var $ = require('jquery');
var $j = jQuery.noConflict();
window.toggle_collapse_with_text = function(element, text_open, text_close) {
    //function collapse button
    
    $j(element).click(function () {
        var target_div = $j(this).data("target");
        $j(target_div).toggle(function () {

            if ($j(this).css('display') == 'none') {
                $j(element).find('.toggling-text').html(text_close);//change the button label when Shown collapse
            } else {
                $j(element).find('.toggling-text').html(text_open);//change the button label when hiden collapse
            }
        });
    });
}
window.toggle_collapse_with_text_shop = function(element, text_open, text_close) {
    //function collapse button
    
    $j(element).click(function () {
        var target_div = $j(this).data("target");
        $j('.collapse').toggle(function () {

            if ($j(this).css('display') == 'none') {
                $j(element).find('.toggling-text').html(text_close);//change the button label when Shown collapse
            } else {
                $j(element).find('.toggling-text').html(text_open);//change the button label when hiden collapse
            }
        });
    });
}
