/**
 * Created by cbrownroberts on 6/29/16.
 */

function guideCollection() {

    "use strict";

    var myGuideCollection = {

        settings : {
            collectionActionUrl : "/control/guides/helpers/collections.php?"
        },
        strings : {
            removeGuideBtn: "<a class='remove-guide-btn'><i class='fa fa-remove'></i> </a>"
        },
        bindUiActions : function() {

            myGuideCollection.addCollection();
            myGuideCollection.deleteCollection();
            myGuideCollection.guideSearch();
            myGuideCollection.addGuideToCollection();
            myGuideCollection.updateCollection();
            myGuideCollection.displayCollectionGuides();
        },
        init : function() {
            myGuideCollection.bindUiActions();
            myGuideCollection.fetchCollections();
            myGuideCollection.hideSearchResultsContainer();
            myGuideCollection.hideGuideListContainer();
        },

        fetchCollections: function () {

            // define payload
            var payload = {
                'action' : 'fetchall',
            };

            $.ajax({
                url: myGuideCollection.settings.collectionActionUrl,
                type: "GET",
                data: payload,
                dataType: "json",
                success: function(data) {
                    console.log(data);

                    $.each(data.collections, function(idx, obj) {
                        $("#guide-collection-list").append( "<li " +
                            "data-collection_id='" + obj.collection_id + "'" +
                            "data-shortform='" + obj.shortform + "'" +
                            "data-label='" + obj.title + "'" +
                            "data-description='" + obj.description + "'" +
                            " id='item_"+ obj.collection_id +"' class='' title='" + obj.title + "'> " +
                            "<a id='display-guides-btn'><i class='fa fa-edit'></i></a> " +
                            "<a id='delete-collection-btn'><i class='fa fa-trash'></i></a> " +obj.title + "</li>");
                    });

                }
            });

        },

        addCollectionRequest: function () {
            var payload = {
                'action'      : 'create',
                'title'       : $('#title').val(),
                'description' : $('#description').val(),
                'shortform'   : $('#shortform').val()
            };

            $.ajax({
                url: myGuideCollection.settings.collectionActionUrl,
                type: "POST",
                dataType: "json",
                data: payload,
                success: function(data) {
                    myGuideCollection.fetchCollectionRequest(data.lastInsertId);
                }
            });
        },

        fetchCollectionRequest: function (id) {

            var payload = {
                'action': 'fetchone',
                'collection_id' : id
            };


            $.ajax({
                url: myGuideCollection.settings.collectionActionUrl,
                type: "GET",
                dataType: "json",
                data: payload,
                success: function(data) {

                    var obj = data.collection;

                    $("#guide-collection-list").prepend( "<li " +
                        "data-collection_id='" + obj.collection_id + "'" +
                        "data-label='" + obj.title + "'" +
                        "data-description='" + obj.description + "'" +
                        " id='item_"+ obj.collection_id +"' class='' title='" + obj.title + "'> " +
                        "<a id='display-guides-btn'><i class='fa fa-edit'></i></a> " +
                        "<a id='delete-collection-btn'> <i class='fa fa-trash'></i></a> " +obj.title + "</li>");

                    $('#item_' + obj.collection_id).effect( "highlight" );

                    myGuideCollection.clearCollectionMetadata();
                    myGuideCollection.clearFormValues();
                    myGuideCollection.renderFlashMsg(obj.title + ' Collection Created');
                    myGuideCollection.renderCollectionMetadata(obj.title, obj.description, obj.shortform, obj.collection_id);
                    myGuideCollection.showGuideCollectionViewportContainer();
                    myGuideCollection.showSearchResultsContainer();
                    myGuideCollection.showGuideListContainer();
                }
            });

        },

        addCollection: function () {
            $('#add_collection').on('click', function() {

                //clear guide list
                myGuideCollection.clearGuideList();

                //add collection to db and display collection metadata
                myGuideCollection.addCollectionRequest();
            });
        },

        updateCollection: function () {

            $('body').on('click', '#update-collection-btn', function () {

                var collection_id = $(this).parent('li').attr('data-collection_id');
                var payload = {
                    'action': 'update',
                    'collection_id' : collection_id,
                };

                $.ajax({
                    url: myGuideCollection.settings.collectionActionUrl,
                    type: "GET",
                    dataType: "json",
                    data: payload,
                    success: function(data) {

                    }
                });

            });
        },

        deleteCollection: function() {

            $('body').on('click', '#delete-collection-btn', function () {

                var elementDestoyed = $(this).parent('li');
                var payload = {
                    'action' : 'delete',
                    'collection_id' : $(this).parent('li').attr('data-collection_id'),
                };

                $.ajax({
                    url: myGuideCollection.settings.collectionActionUrl,
                    type: "POST",
                    dataType: "json",
                    data: payload,
                    success: function(data) {
                        //render flash msg
                        myGuideCollection.renderFlashMsg('Collection Deleted');

                        //remove element from collection list
                        $(elementDestoyed).remove();
                        
                        //clear collection metadata
                        myGuideCollection.clearCollectionMetadata();
                        
                        //clear form value
                        myGuideCollection.clearFormValues();
                        
                        //clear search results
                        myGuideCollection.clearSearchResults();
                        
                        //clear guide list
                        myGuideCollection.clearGuideList();

                        //hide the guide container viewport container
                        myGuideCollection.hideGuideCollectionViewportContainer();
                    }
                });
            });
        },

        guideSearch: function () {
            // Autocomplete search
            $(' #add-guide-input').keyup(function (data) {
                if ($('#add-guide-input').val().length > 2) {
                    
                    var searchTerm = $('#add-guide-input').val();
                    var url = '../includes/autocomplete_data.php?';
                    var collection = 'all_guides';
                    //showInactive === true ? collection = "all_guides" : collection = "guides";
                    var payload = {
                        'term': searchTerm,
                        'collection': collection
                    };

                    $('#guide-search-results').empty();

                    $.ajax({
                        url: url,
                        type: "GET",
                        dataType: "json",
                        data: payload,
                        success: function(data) {
                            //console.log(data);

                            $.each(data, function (index, obj) {
                                var addBtn = "<a class='add-guide-btn'><i class='fa fa-plus'></i> </a>";
                                
                                $('#guide-search-results').prepend('<li data-guide_id="' + obj.id + '">' + addBtn + obj.label + '</li>');

                            })
                        }
                    });
                    
                }

            });
        },

        addGuideToCollection: function () {

            
            $('body').on('click', '.add-guide-btn', function () {
                var label = $(this).closest('li').text();
                var payload = {
                    'action' : 'addguide',
                    'collection_id' : $('#collection-title').attr('data-collection_id'),
                    'subject_id': $(this).closest('li').attr('data-guide_id')
                };

                $.ajax({
                    url: myGuideCollection.settings.collectionActionUrl,
                    type: "POST",
                    dataType: "json",
                    data: payload,
                    success: function(data) {
                        $('#guide-list').prepend( '<li>' + label + myGuideCollection.strings.removeGuideBtn + '</li>' );
                    }
                });

            })
            
        },

        displayCollectionGuides: function () {

            $('body').on('click', '#display-guides-btn', function () {
                
                var collection_id = $(this).parent('li').attr('data-collection_id');
                var title         = $(this).parent('li').attr('data-label');
                var description   = $(this).parent('li').attr('data-description');
                var shortform     = $(this).parent('li').attr('data-shortform');


                //clear guide list
                myGuideCollection.clearGuideList();

                var payload = {
                    'action' : 'fetchguides',
                    'collection_id' : collection_id
                };

                $.ajax({
                    url: myGuideCollection.settings.collectionActionUrl,
                    type: "GET",
                    dataType: "json",
                    data: payload,
                    success: function(data) {

                        //show guide collection viewport container
                        myGuideCollection.showGuideCollectionViewportContainer();

                        //clear any collection metadata
                        myGuideCollection.clearCollectionMetadata();

                        //render collection metadata
                        myGuideCollection.renderCollectionMetadata(title, description, shortform, collection_id);

                        //clear form values
                        myGuideCollection.clearFormValues();

                        //clear search results
                        myGuideCollection.clearSearchResults();

                        //render search results
                        myGuideCollection.showSearchResultsContainer();

                        //render guide list container
                        myGuideCollection.showGuideListContainer();

                        //render guides
                        var guides = data.guides;
                        $.each(guides, function (index, obj) {
                            var label = obj.subject;
                            $('#guide-list').prepend( '<li>' + label + myGuideCollection.strings.removeGuideBtn + '</li>' );
                        });



                    }
                });
            });
        },

        clearFlashMsg: function () {
            $('#flash-msg').html(' ');
        },
        renderFlashMsg: function (msg) {
            myGuideCollection.clearFlashMsg();
            $('#flash-msg').append(msg).addClass( 'success-msg' );
        },

        clearCollectionMetadata: function () {
            $('#collection-title').html(' ');
            $('#collection-description').html('');
            $('#collection-shortform').html('');
        },

        renderCollectionMetadata: function (title, description, shortform, collection_id) {
            $('#collection-title').attr('data-collection_id', collection_id);
            $('#collection-title').append(title);
            $('#collection-description').append(description);
            $('#collection-shortform').append(shortform);
        },

        clearFormValues: function () {
            $('#title').val('');
            $('#description').val('');
            $('#shortform').val('');
            $('#add-guide-input').val();
        },

        showGuideCollectionViewportContainer: function () {
            $('#guide-collection-viewport-container').show();
        },

        hideGuideCollectionViewportContainer: function () {
          $('#guide-collection-viewport-container').hide();
        },

        showSearchResultsContainer: function () {
            $('#search-results-container').show()
        },

        hideSearchResultsContainer: function () {
            $('#search-results-container').hide();
        },

        clearSearchResults: function () {
            $('#guide-search-results').empty();
        },

        showGuideListContainer: function () {
            $('#guide-list-container').show();
        },

        hideGuideListContainer: function () {
            $('#guide-list-container').hide();
        },

        clearGuideList: function () {
            $('#guide-list').empty();
        }

    };

    return myGuideCollection;
}

