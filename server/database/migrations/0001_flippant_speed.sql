ALTER TABLE `addresses` MODIFY COLUMN `updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `users` ADD `firstname` varchar(64) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `lastname` varchar(64) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `dateOfBirth` timestamp;