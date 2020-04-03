$(document).ready(() => {

    $('.sh-parent-c').on('click', (e) => {

        // Target
        var t = $(e.target);

        // Read category ID
        var c = t.data('c-pk');

        // Toggle cards
        if (t.hasClass('selected')) {

            // Unselect

            // Change style
            t.removeClass('selected');

            // Hide child menu
            $('.sh-child-tree').hide();

            // Show all cards
            $('.sh-card').show();

            // Save state
            t.removeClass('selected');

        } else {

            // Select

            // Change style
            t.addClass('selected');
            $('.sh-parent-c').not(t).removeClass('selected');
            $('.sh-child-c').not(t).removeClass('selected');

            // Show child menu
            $('.sh-child-tree').hide();
            t.next('.sh-child-tree').show();

            // Show matching cards
            $('.sh-cat-' + c).show();

            // Hide other cards
            $('.sh-card').not('.sh-cat-' + c).hide();

            // Save state
            t.addClass('selected');

        }

    });


    $('.sh-child-c').on('click', (e) => {

        // Target
        var t = $(e.target);

        // Read category ID
        var c = t.data('c-pk');

        // Toggle cards
        if (t.hasClass('selected')) {

            // Unselect

            // Change style
            t.removeClass('selected');

            // Show all cards
            $('.sh-card').show();

            // Save state
            t.removeClass('selected');

        } else {

            // Select

            // Change style
            t.addClass('selected');
            $('.sh-parent-c').not(t).removeClass('selected');
            $('.sh-child-c').not(t).removeClass('selected');

            // Show matching cards
            $('.sh-cat-' + c).show();

            // Hide other cards
            $('.sh-card').not('.sh-cat-' + c).hide();

            // Save state
            t.addClass('selected');

        }

    });

});