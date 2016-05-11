<?php
/**
 * Created by PhpStorm.
 * User: cbrownroberts
 * Date: 5/11/16
 * Time: 3:45 PM
 */

namespace SubjectsPlus\Control;


interface TransformInterface
{
    public function transformToXml();
    public function transformToHtml();
}