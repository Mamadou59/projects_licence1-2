<?php
/*
  * Returns image ressource initialized with data from $stream (auto-detect format)
  */
function createImageFromStream($stream){
    return imagecreatefromstring(stream_get_contents($stream));
}
/*
 * Returns image ressource initialized with data from $fileName (auto-detect format)
 */
function createImageFromFile($fileName){
    return imagecreatefromstring(file_get_contents($fileName));
}
?>