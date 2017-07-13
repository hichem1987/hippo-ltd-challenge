/* homepage specific */
var $ = require('jquery');
var bootstrap = require('bootstrap');
var $j = jQuery.noConflict();
require("../components/collapse");
require("jquery-validation");

$j(document).ready(function () {
    // add Active for J'ai déjà un compte
    $j(".toggleAccountLogin").click(function () {
        $j(this).closest("li").toggleClass("active");
    });
    // block empty click
    $j(".cartTabPanel .tab-account a").click(function (e) {
        e.preventDefault();
    })

    $j(".allLocTabs a[data-toggle=tab]").on("click", function (e) {
        if ($j(this).find("input").prop('disabled')) {
            e.preventDefault();
            return false;
        }
    });
    // based on url activate step
    var url = window.location.href;
    if (url.indexOf('?') != -1) {
        var stepNo = url.split(/[\s?&]+/);
        // ignore first one is url always
        if ((stepNo) && (stepNo.length > 0)) {


            var stepNoLen = stepNo.length;
            for (var i = 1; i < stepNoLen; i++) {
                var curParameter = stepNo[i].split('=');
                if ((curParameter.length > 1) && (curParameter[0] == "step") && (curParameter[1].length > 0)) {
                    // check url have keyword step and value then swich tab content
                    if (parseInt(curParameter[1]) == 1) {
                        $j(".cartTabPanel").removeClass("step-two").removeClass("step-three").addClass("step-one");
                    }
                    else if (parseInt(curParameter[1]) == 2) {
                        $j(".cartTabPanel").removeClass("step-one").removeClass("step-three").addClass("step-two");
                    }
                    else if (parseInt(curParameter[1]) == 3) {
                        $j(".cartTabPanel").removeClass("step-one").removeClass("step-two").addClass("step-three");
                    }
                }
            }
        }
    }


// Wait for the DOM to be ready
    // Initialize form validation on the registration form.
    // It has the name attribute "registration"
    $j("form[name='cart-user-login']").validate({
        // Specify validation rules
        errorClass: "error-message",
        validClass: 'valide-message',
        errorElement: "span",

        // Specify validation error messages

        errorPlacement: function (error, element) {
            $j(element).closest(".form-element").find('.error-bloc').html(error);
        },
        highlight: function (element, errorClass, validClass) {
            $j(element).closest(".form-element").addClass(errorClass).removeClass(validClass);
        },
        unhighlight: function (element, errorClass, validClass) {
            $j(element).closest(".form-element").removeClass(errorClass).addClass(validClass);
        },

        // Make sure the form is submitted to the destination defined
        // in the "action" attribute of the form when valid
        submitHandler: function (form) {
            form.submit();
        }
    });
    /*$j(".numberonly").rules("add", {
        number: true
    });*/

    jQuery.validator.addClassRules("numberonly", {
        number: true
    });
    // Initialize form validation for add new address on step 2.
    $j("form[name='add-new-address']").validate({
        // Specify validation rules
        errorClass: "error-message",
        validClass: 'valide-message',
        errorElement: "span",

        errorPlacement: function (error, element) {
            $j(element).closest(".form-element").find('.error-bloc').html(error);
        },
        highlight: function (element, errorClass, validClass) {
            $j(element).closest(".form-element").addClass(errorClass).removeClass(validClass);
        },
        unhighlight: function (element, errorClass, validClass) {
            $j(element).closest(".form-element").removeClass(errorClass).addClass(validClass);
        },
        // Make sure the form is submitted to the destination defined
        // in the "action" attribute of the form when valid
        submitHandler: function (form) {
            form.submit();
        }
    });

});

