-- Add sample activity logs for testing
INSERT INTO activity_logs (user_id, action, details, timestamp) VALUES 
(1, 'UPLOAD', '{"fileName": "sample.pdf", "fileSize": "2.5 MB"}', NOW() - INTERVAL 1 HOUR),
(1, 'CREATE_FOLDER', '{"folderName": "Documents"}', NOW() - INTERVAL 2 HOUR),
(1, 'VIEW', '{"fileName": "sample.pdf"}', NOW() - INTERVAL 30 MINUTE),
(1, 'DOWNLOAD', '{"fileName": "sample.pdf"}', NOW() - INTERVAL 15 MINUTE),
(1, 'SET_PASSWORD', '{"fileName": "confidential.doc"}', NOW() - INTERVAL 45 MINUTE);