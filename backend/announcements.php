<?php
header('Content-Type: application/json');
$announcements = [
    ['title'=>'Admission Now Open for 2026','body'=>'We are now accepting applications for Nursery and Primary School.','date'=>'Jan 15, 2026'],
    ['title'=>'Inter-House Sports Competition','body'=>'Annual sports event brought excitement and teamwork.','date'=>'Feb 5, 2026'],
    ['title'=>'New Digital Library Resources','body'=>'New e-books and learning materials are available.','date'=>'Mar 10, 2026']
];

echo json_encode(['announcements'=>$announcements]);
