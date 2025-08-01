jQuery(document).ready(function($){

    var wpadminbar = jQuery('#wpadminbar');

    if ( 1 == wpadminbar.length) {
       jQuery('.main-navigation-holder').sticky({topSpacing:wpadminbar.height()});
    } else {
       jQuery('.main-navigation-holder').sticky({topSpacing:0});
    }

});