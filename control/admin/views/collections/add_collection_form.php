<?php
/**
 * Created by PhpStorm.
 * User: cbrownroberts
 * Date: 6/29/16
 * Time: 2:55 PM
 */



$form = "
<label for=\"title\">" . _("Collection Name") . "</label>
<input type=\"text\" id='title' name=\"title\"size=\"40\" class=\"required_field\">
<label for=\"description\">" . _("Description") . "</label>
<textarea name=\"description\" id=\"description\" rows=\"4\" cols=\"50\"></textarea>
<label for=\"url\">" . _("Shortform") . "</label>
<input type=\"text\" id='shortform' name=\"shortform\" size=\"20\"  class=\"required_field\">
<button class=\"button pure-button pure-button-primary\" id=\"add_collection\" name=\"add_collection\" >" . _("Add New Collection") . "</button>
";

echo $form;