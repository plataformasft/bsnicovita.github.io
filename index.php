<?php
// Incluye la clase PHPExcel
require_once 'PHPExcel/PHPExcel.php';

// Crea un nuevo objeto PHPExcel
$objPHPExcel = new PHPExcel();

// Añade datos y manipula el objeto PHPExcel según sea necesario
$objPHPExcel->setActiveSheetIndex(0)
            ->setCellValue('A1', 'Hello')
            ->setCellValue('B1', 'World!');

// Guarda el archivo Excel
$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
$objWriter->save('hello_world.xlsx');

echo 'El archivo Excel "hello_world.xlsx" fue creado con éxito.';
?>

