<?php

/**
 *   @file save_guide.php
 *   @brief Save the contents of the guide.
 *   @description Called by guide.js, which passes in an array of all the pluslets for a guide
 *   and their position within the page (i.e., left, center or right column + row number).  The existing
 *   entries in the intervening pluslet_tab table are emptied out, and new ones are added.
 *
 *   @author agdarby, dgonzalez
 *   @date updated jul 2013
 */


$subsubcat = "";
$subcat = "guides";
$page_title = "Save Guides include";
$header = "noshow";


include("../../includes/header.php");

//print_r($_POST);

// Connect to database
try {$dbc = new DBConnector($uname, $pword, $dbName_SPlus, $hname);} catch (Exception $e) { echo $e;}

$lobjTabs = json_decode($_POST['tabs'], true);

// Remove all existing entries for that guide from intervening table
$subject_id = $_POST["this_subject_id"];

$qs = "SELECT tab_id FROM tab WHERE subject_id = '$subject_id'";
$drs = $db->query($qs);

while($row = mysql_fetch_array($drs))
{
	$qd = "DELETE FROM pluslet_tab WHERE tab_id = '{$row[0]}'";
	$dr = $db->query($qd);

	$qd = "DELETE FROM tab WHERE tab_id = '{$row[0]}'";
	$dr = $db->query($qd);
}

$lintTabIndex = 0;

foreach( $lobjTabs as $lobjTab )
{
	$qi = "INSERT INTO tab (subject_id, label, tab_index, external_url) VALUES ('$subject_id', '{$lobjTab['name']}', $lintTabIndex, '{$lobjTab['external']}')";
	//print $qi . "<br />";
	$ir = $db->query($qi);

	$lintTabId = mysql_insert_id($dbc->getConnection());

	$left_col = $lobjTab["left_data"];
	$center_col = $lobjTab["center_data"];
	$sidebar = $lobjTab["sidebar_data"];

	//added by dgonzalez in order to separate by '&pluslet[]=' even if dropspot-left doesn't exist
	$left_col = "&" . $left_col;
	$center_col = "&" . $center_col;
	$sidebar = "&" . $sidebar;

	// remove the "drop here" non-content & get all our "real" contents into array
	$left_col = str_replace("dropspot-left[]=1", "", $left_col);
	$leftconts = explode("&pluslet[]=", $left_col);

	$center_col = str_replace("dropspot-center[]=1", "", $center_col);
	$centerconts = explode("&pluslet[]=", $center_col);

	$sidebar = str_replace("dropspot-sidebar[]=1", "", $sidebar);
	$sidebarconts = explode("&pluslet[]=", $sidebar);

	// CHECK IF THERE IS CONTENT

	// Now insert the appropriate entries

	foreach ($leftconts as $key => $value) {
		if ($key != 0) {
			$qi = "INSERT INTO pluslet_tab (pluslet_id, tab_id, pcolumn, prow) VALUES ('$value', '$lintTabId', 0, '$key')";
			//print $qi . "<br />";
			$ir = $db->query($qi);
		}
	}

	foreach ($centerconts as $key => $value) {
		if ($key != 0) {
			$qi = "INSERT INTO pluslet_tab (pluslet_id, tab_id, pcolumn, prow) VALUES ('$value', '$lintTabId', 1, '$key')";
			//print $qi . "<br />";
			$ir = $db->query($qi);
		}
	}

	foreach ($sidebarconts as $key => $value) {
		if ($key != 0) {
			$qi = "INSERT INTO pluslet_tab (pluslet_id, tab_id, pcolumn, prow) VALUES ('$value', '$lintTabId', 2, '$key')";
			//print $qi . "<br />";
			$ir = $db->query($qi);
		}
	}

	$lintTabIndex++;
}

/////////////////////
// Alter chchchanges table
// table, flag, item_id, title, staff_id
////////////////////

//$updateChangeTable = changeMe("guide", "update", $_COOKIE["our_guide_id"], $_COOKIE["our_guide"], $_SESSION['staff_id']);


//print "<script type='text/javascript'>$.growl.notice({message: 'The guide was updated successfully.', title:'" . _("Guide Updated.") . "'})</script>";

print "<strong>" . _("Thy Will Be Done:  Guide Updated.") . "</strong>";
?>
