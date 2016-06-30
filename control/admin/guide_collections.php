<?php
/**
 *   @file guide_collections.php
 *   @brief CRUD collections of guides for display on public page
 *
 *   @author adarby
 *   @date Aug 2015
 *   
 */

use SubjectsPlus\Control\Querier;

    
$subsubcat = "";
$subcat = "admin";
$page_title = "Admin Guide Collections";
$feedback = "";

//var_dump($_POST);

include("../includes/header.php");
include("../includes/autoloader.php");


ob_start();
include_once ('views/collections/add_collection_form.php');
$add_collection_box = ob_get_contents();
ob_end_clean();


$guide_collection_list =  "<div id='guide-collection-list-container'>";
$guide_collection_list .= "<ul id='guide-collection-list'></ul>";
$guide_collection_list .= "</div>";

$guide_collection_viewport =  "<div id='guide-collection-viewport-container'>";

$guide_collection_viewport .= "<div id='collection-metadata' data-collection_id=''>";
$guide_collection_viewport .= "<h3 id='collection-title'></h3>";
$guide_collection_viewport .= "<p id='collection-description'></p>";
$guide_collection_viewport .= "<p id='collection-shortform'></p>";
$guide_collection_viewport .= "</div>";

$guide_collection_viewport .= "<div id='search-results-container'>";
$guide_collection_viewport .= "<input id='add-guide-input' type='text' name='add-guide-input' />";
$guide_collection_viewport .= "<div><h4>Search Results</h4><ul id='guide-search-results'></ul></div>";
$guide_collection_viewport .= "</div>";


$guide_collection_viewport .= "<div id='guide-list-container'>";
$guide_collection_viewport .= "<h3 id='guide-label'>Associated Guides</h3>";
$guide_collection_viewport .= "<ul id='guide-list'></ul>";
$guide_collection_viewport .= "</div>";

$guide_collection_viewport .= "</div>";





?>
<style>
    .flash-msg-container {
        display: block;
        height: 20px;
    }
    p#flash-msg {
        text-align: center;
    }
</style>


<div class="pure-g">

    <div class="pure-u-1">
        <div class="flash-msg-container"><p id="flash-msg"></p></div>
    </div>

    <div class="pure-u-1-3">
        <?php echo makePluslet(_("Add Collection"), $add_collection_box , "no_overflow"); ?>
        <?php echo makePluslet(_("Guide Collections"), $guide_collection_list, "no_overflow"); ?>
    </div>

    <div class="pure-u-2-3">
        <?php echo makePluslet(_("Add Guides"), $guide_collection_viewport, "no_overflow"); ?>
    </div>

</div>

<script>
    var gc = guideCollection();
    gc.init();
</script>