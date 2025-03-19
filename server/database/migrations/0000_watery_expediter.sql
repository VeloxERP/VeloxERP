CREATE TABLE `addresses` (
	`id` varchar(36) NOT NULL,
	`type` enum('company','person') NOT NULL,
	`name` varchar(128) NOT NULL,
	`street` varchar(128) NOT NULL,
	`city` varchar(128) NOT NULL,
	`zip` varchar(128) NOT NULL,
	`state` varchar(128) NOT NULL,
	`country` varchar(2) NOT NULL,
	`updated_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`deleted_at` timestamp,
	CONSTRAINT `addresses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(36) NOT NULL,
	`username` varchar(32) NOT NULL,
	`email` varchar(256) NOT NULL,
	`password` text NOT NULL,
	`address_id` varchar(36),
	`updated_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`deleted_at` timestamp,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_username_unique` UNIQUE(`username`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_address_id_addresses_id_fk` FOREIGN KEY (`address_id`) REFERENCES `addresses`(`id`) ON DELETE no action ON UPDATE no action;