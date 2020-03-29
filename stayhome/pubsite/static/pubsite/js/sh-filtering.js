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
            $('.sh-card').removeClass('sh-hide-c');

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
            t.next('.sh-child-tree').find('.sh-child-c').show();

            // Show matching cards
            $('.sh-cat-' + c).removeClass('sh-hide-c');

            // Hide other cards
            $('.sh-card').not('.sh-cat-' + c).addClass('sh-hide-c');

            // Save state
            t.addClass('selected');

        }
        
        ensureAllFiltered();

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

            // Show siblings
            t.siblings().show();

            // Show all cards
            $('.sh-card').removeClass('sh-hide-c');

            // Save state
            t.removeClass('selected');

        } else {

            // Select

            // Change style
            t.addClass('selected');
            $('.sh-parent-c').not(t).removeClass('selected');
            $('.sh-child-c').not(t).removeClass('selected');

            // Hide siblings
            t.siblings().hide();

            // Show matching cards
            $('.sh-cat-' + c).removeClass('sh-hide-c');

            // Hide other cards
            $('.sh-card').not('.sh-cat-' + c).addClass('sh-hide-c');

            // Save state
            t.addClass('selected');

        }
        
        ensureAllFiltered();

    });

    // Textual search
    $('#searchInput').on('keyup', (event) => {

        // Current value
        var search = event.target.value.toLowerCase();

        // Loop on cards
        $('.sh-card').each((id, target) => {

            // Target
            var t = $(target);

            var subject = t.data('categories').toLowerCase() + " " + $(target).data('name').toLowerCase();

            if (subject.includes(search)) {
                t.removeClass('sh-hide-t');
            } else {
                t.addClass('sh-hide-t');
            }
            
        });

        // No result
        ensureAllFiltered();

        // Stop execution
        event.preventDefault();

    });
    
    // Filtering by distance
    var areaMap = [7, 5, 4, 3];
    $('#area-slider').slider().on('slide', e => {
        var maxRadius = areaMap[e.value];
        $('.sh-card').each((id, elem) => {
            var card = $(elem);
            var radius = parseInt(card.data('radius'));
            if (radius > maxRadius) {
                card.addClass('sh-hide-d');
            } else {
                card.removeClass('sh-hide-d');
            }
        });
        
        ensureAllFiltered();

    }).data('slider');

    // See more links
    window.see_more = (pk) => {
        $('#descr-' + pk).toggleClass('sh-crop');
        $('#more-' + pk).toggle();
        $('#plus-' + pk).toggle();
        $('#minus-' + pk).toggle();
    }

    // Toggle display
    window.ensureAllFiltered = () => {

        // Hide or show
        $('.sh-hide-c, .sh-hide-t, .sh-hide-d').hide();
        $('.sh-card').not('.sh-hide-c, .sh-hide-t, .sh-hide-d').show();

        if ($('.sh-card:visible').length === 0) {
            $('#allFiltered').show();
        } else {
            $('#allFiltered').hide();
        }
    }

    // Report
    $('.sh-report').on('click', (e) => {

        // Target
        var t = $(e.target);

        // Business PK
        var pk = t.data('pk');
        $('#modalPk').val(pk);

        // Display modal
        $('#reportModal').modal();

    });

    $('.sh-report-btn').on('click', (e) => {

        // Validate form
        if (!$('#reportForm')[0].checkValidity()) {
            window.alert('Please select a reason.');
            return;
        }

        // Build data
        var data = {
            'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').first().val(),
            'name': 'Report form',
            'email': 'info@stayhome.ch',
            'message': JSON.stringify({
                'business': $('#modalPk').val(),
                'npa': $('input[name="reportNpa"]').first().val(),
                'type': $('input[name="reportType"]:checked').first().val(),
                'message': $('textarea[name="reportDetails"]').first().val()
            })
        }

        // Post
        $.post(
            '/about/',
            data
        )

        // Message
        $('#reportModalBody').hide();
        $('#reportModalBodyConfirmation').show();

    });

});