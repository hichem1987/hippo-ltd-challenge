/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var $j = jQuery.noConflict();


$customSelect= $j("[data-custom-select]");
/*** custom select***/
$customSelect.each(function() {

    var thisSelect = $j(this);
    var thisOptions =thisSelect.find("option");
    var numberOfOptions = thisSelect.children('option').length;

    // Hides the select element
    thisSelect.addClass('s-hidden');

    // Wrap the select element in a div
    thisSelect.wrap('<div class="select"></div>');

    // Insert a styled div to sit over the top of the hidden select element
    thisSelect.after('<div class="styledSelect select-loc"></div>');

    // Cache the styled div
    var $styledSelect = thisSelect.next('div.styledSelect');

    // Show the first select option in the styled div
    $styledSelect.text(thisSelect.children('option').eq(0).text());

    // Insert an unordered list after the styled div and also cache the list
    var $list = $j('<ul />', {
        'class': 'options'
    }).insertAfter($styledSelect);

    // Insert a list item into the unordered list for each select option
    for (var i = 0; i < numberOfOptions; i++) {
        $j('<li />', {
            text: thisSelect.children('option').eq(i).text(),
            rel: thisSelect.children('option').eq(i).val()
        }).appendTo($list);
    }

    // Cache the list items
    var $listItems = $list.children('li');

    // Show the unordered list when the styled div is clicked (also hides it if the div is clicked again)
    var select_ville = false;

    $styledSelect.click(function(e) {
        e.stopPropagation();
        if (select_ville === true) {
            select_ville = !select_ville;
            $styledSelect.removeClass('active');
            $list.hide();
            return false;
        }
        select_ville = !select_ville;
        $j('div.styledSelect.active').each(function() {
            $j(this).removeClass('active').next('ul.options').hide();
        });
        $j(this).toggleClass('active').next('ul.options').toggle();
    });

    // Hides the unordered list when a list item is clicked and updates the styled div to show the selected list item
    // Updates the select element to have the value of the equivalent option
    $listItems.click(function(e) {
        select_ville = !select_ville;
        e.stopPropagation();
        $styledSelect.text($j(this).text()).removeClass('active');
        thisSelect.val($j(this).attr('rel'));
        thisOptions.eq($j(this).index()).prop('selected', true);
        $list.hide();
        /* alert($this.val()); Uncomment this for demonstration! */
    });

    // Hides the unordered list when clicking outside of it
    $j(document).click(function() {
        if (thisSelect.closest(".customSelectContainer").find($styledSelect).hasClass('active')) {
            select_ville = !select_ville;
        }

        $styledSelect.removeClass('active');
        $list.hide();
    });
});

/* end of custom select */
