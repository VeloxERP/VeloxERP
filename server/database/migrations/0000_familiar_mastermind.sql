CREATE TABLE `addresses` (
	`id` varchar(36) NOT NULL,
	`type` enum('company','person') NOT NULL,
	`name` varchar(128) NOT NULL,
	`street` varchar(128) NOT NULL,
	`city` varchar(128) NOT NULL,
	`zip` varchar(128) NOT NULL,
	`state` varchar(128) NOT NULL,
	`country` varchar(2) NOT NULL,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`deleted_at` timestamp,
	CONSTRAINT `addresses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `account` (
	`id` varchar(36) NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` timestamp(3),
	`refresh_token_expires_at` timestamp(3),
	`scope` text,
	`password` text,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL,
	CONSTRAINT `account_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `invitation` (
	`id` varchar(36) NOT NULL,
	`organization_id` varchar(36) NOT NULL,
	`email` text NOT NULL,
	`role` text,
	`team_id` text,
	`status` text NOT NULL DEFAULT ('pending'),
	`expires_at` timestamp(3) NOT NULL,
	`inviter_id` varchar(36) NOT NULL,
	CONSTRAINT `invitation_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `member` (
	`id` varchar(36) NOT NULL,
	`organization_id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`role` text NOT NULL DEFAULT ('member'),
	`created_at` timestamp(3) NOT NULL,
	CONSTRAINT `member_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `organization` (
	`id` varchar(36) NOT NULL,
	`name` text NOT NULL,
	`slug` varchar(255) NOT NULL,
	`logo` text,
	`created_at` timestamp(3) NOT NULL,
	`metadata` text,
	CONSTRAINT `organization_id` PRIMARY KEY(`id`),
	CONSTRAINT `organization_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `organization_role` (
	`id` varchar(36) NOT NULL,
	`organization_id` varchar(36) NOT NULL,
	`role` text NOT NULL,
	`permission` text NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3),
	CONSTRAINT `organization_role_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `passkey` (
	`id` varchar(36) NOT NULL,
	`name` text,
	`public_key` text NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`credential_id` text NOT NULL,
	`counter` int NOT NULL,
	`device_type` text NOT NULL,
	`backed_up` boolean NOT NULL,
	`transports` text,
	`created_at` timestamp(3),
	`aaguid` text,
	CONSTRAINT `passkey_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` varchar(36) NOT NULL,
	`expires_at` timestamp(3) NOT NULL,
	`token` varchar(255) NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` varchar(36) NOT NULL,
	`impersonated_by` text,
	`active_organization_id` text,
	`active_team_id` text,
	CONSTRAINT `session_id` PRIMARY KEY(`id`),
	CONSTRAINT `session_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `team` (
	`id` varchar(36) NOT NULL,
	`name` text NOT NULL,
	`organization_id` varchar(36) NOT NULL,
	`created_at` timestamp(3) NOT NULL,
	`updated_at` timestamp(3),
	CONSTRAINT `team_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `team_member` (
	`id` varchar(36) NOT NULL,
	`team_id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`created_at` timestamp(3),
	CONSTRAINT `team_member_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `two_factor` (
	`id` varchar(36) NOT NULL,
	`secret` text NOT NULL,
	`backup_codes` text NOT NULL,
	`user_id` varchar(36) NOT NULL,
	CONSTRAINT `two_factor_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` varchar(36) NOT NULL,
	`name` text NOT NULL,
	`email` varchar(255) NOT NULL,
	`email_verified` boolean NOT NULL DEFAULT false,
	`image` text,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()),
	`username` varchar(255),
	`display_username` text,
	`two_factor_enabled` boolean DEFAULT false,
	`role` text DEFAULT ('user'),
	`banned` boolean DEFAULT false,
	`ban_reason` text,
	`ban_expires` timestamp(3),
	`first_name` text,
	`last_name` text,
	CONSTRAINT `user_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_email_unique` UNIQUE(`email`),
	CONSTRAINT `user_username_unique` UNIQUE(`username`)
);
--> statement-breakpoint
CREATE TABLE `verification` (
	`id` varchar(36) NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` timestamp(3) NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `verification_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `product_categories` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`parent_id` varchar(36),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`deleted_at` timestamp,
	CONSTRAINT `product_categories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`sku` varchar(50) NOT NULL,
	`category_id` varchar(36),
	`price` decimal(10,2) NOT NULL,
	`cost` decimal(10,2),
	`quantity` int NOT NULL DEFAULT 0,
	`min_quantity` int NOT NULL DEFAULT 0,
	`max_quantity` int,
	`is_active` boolean NOT NULL DEFAULT true,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`deleted_at` timestamp,
	CONSTRAINT `products_id` PRIMARY KEY(`id`),
	CONSTRAINT `products_sku_unique` UNIQUE(`sku`)
);
--> statement-breakpoint
CREATE TABLE `prod_num_seq` (
	`id` varchar(36) NOT NULL,
	`prefix` varchar(10) NOT NULL,
	`last_number` int NOT NULL DEFAULT 0,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`deleted_at` timestamp,
	CONSTRAINT `prod_num_seq_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `prod_vars` (
	`id` varchar(36) NOT NULL,
	`product_id` varchar(36) NOT NULL,
	`name` varchar(255),
	`description` text,
	`product_number` varchar(50) NOT NULL,
	`price` decimal(10,2),
	`cost` decimal(10,2),
	`quantity` int NOT NULL DEFAULT 0,
	`attributes` json DEFAULT ('{}'),
	`inherited_fields` json DEFAULT ('["name","price","cost"]'),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`deleted_at` timestamp,
	CONSTRAINT `prod_vars_id` PRIMARY KEY(`id`),
	CONSTRAINT `prod_vars_product_number_unique` UNIQUE(`product_number`)
);
--> statement-breakpoint
CREATE TABLE `prod_props` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`code` varchar(100) NOT NULL,
	`type` enum('select','color','text','number','boolean') NOT NULL DEFAULT 'select',
	`description` text,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`deleted_at` timestamp,
	CONSTRAINT `prod_props_id` PRIMARY KEY(`id`),
	CONSTRAINT `prod_props_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `prop_values` (
	`id` varchar(36) NOT NULL,
	`property_id` varchar(36) NOT NULL,
	`value` varchar(255) NOT NULL,
	`display_name` varchar(255),
	`position` int DEFAULT 0,
	`color_code` varchar(7),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`deleted_at` timestamp,
	CONSTRAINT `prop_values_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `prod_prop_assoc` (
	`id` varchar(36) NOT NULL,
	`product_id` varchar(36) NOT NULL,
	`property_id` varchar(36) NOT NULL,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`deleted_at` timestamp,
	CONSTRAINT `prod_prop_assoc_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `var_prop_vals` (
	`id` varchar(36) NOT NULL,
	`variant_id` varchar(36) NOT NULL,
	`property_id` varchar(36) NOT NULL,
	`value_id` varchar(36) NOT NULL,
	`is_linked` boolean DEFAULT true,
	`custom_value` varchar(255),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`deleted_at` timestamp,
	CONSTRAINT `var_prop_vals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `roles` (
	`name` varchar(32) NOT NULL,
	CONSTRAINT `roles_name` PRIMARY KEY(`name`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(36) NOT NULL,
	`username` varchar(32) NOT NULL,
	`email` varchar(256) NOT NULL,
	`password` char(134) NOT NULL,
	`address_id` varchar(36),
	`firstname` varchar(64) NOT NULL,
	`lastname` varchar(64) NOT NULL,
	`dateOfBirth` timestamp,
	`role` varchar(32) NOT NULL,
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`deleted_at` timestamp,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_username_unique` UNIQUE(`username`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `account` ADD CONSTRAINT `account_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invitation` ADD CONSTRAINT `invitation_organization_id_organization_id_fk` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invitation` ADD CONSTRAINT `invitation_inviter_id_user_id_fk` FOREIGN KEY (`inviter_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `member` ADD CONSTRAINT `member_organization_id_organization_id_fk` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `member` ADD CONSTRAINT `member_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `organization_role` ADD CONSTRAINT `organization_role_organization_id_organization_id_fk` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `passkey` ADD CONSTRAINT `passkey_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `session` ADD CONSTRAINT `session_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `team` ADD CONSTRAINT `team_organization_id_organization_id_fk` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `team_member` ADD CONSTRAINT `team_member_team_id_team_id_fk` FOREIGN KEY (`team_id`) REFERENCES `team`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `team_member` ADD CONSTRAINT `team_member_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `two_factor` ADD CONSTRAINT `two_factor_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product_categories` ADD CONSTRAINT `product_categories_parent_id_product_categories_id_fk` FOREIGN KEY (`parent_id`) REFERENCES `product_categories`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `products_category_id_product_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `product_categories`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `prod_vars` ADD CONSTRAINT `prod_vars_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `prop_values` ADD CONSTRAINT `prop_values_property_id_prod_props_id_fk` FOREIGN KEY (`property_id`) REFERENCES `prod_props`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `prod_prop_assoc` ADD CONSTRAINT `prod_prop_assoc_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `prod_prop_assoc` ADD CONSTRAINT `prod_prop_assoc_property_id_prod_props_id_fk` FOREIGN KEY (`property_id`) REFERENCES `prod_props`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `var_prop_vals` ADD CONSTRAINT `var_prop_vals_property_id_prod_props_id_fk` FOREIGN KEY (`property_id`) REFERENCES `prod_props`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `var_prop_vals` ADD CONSTRAINT `var_prop_vals_value_id_prop_values_id_fk` FOREIGN KEY (`value_id`) REFERENCES `prop_values`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_address_id_addresses_id_fk` FOREIGN KEY (`address_id`) REFERENCES `addresses`(`id`) ON DELETE no action ON UPDATE no action;