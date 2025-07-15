CREATE TABLE `roles` (
	`name` varchar(32) NOT NULL,
	CONSTRAINT `roles_name` PRIMARY KEY(`name`)
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
ALTER TABLE `users` ADD `role` varchar(32) NOT NULL;--> statement-breakpoint
ALTER TABLE `product_categories` ADD CONSTRAINT `product_categories_parent_id_product_categories_id_fk` FOREIGN KEY (`parent_id`) REFERENCES `product_categories`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `products_category_id_product_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `product_categories`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `prod_vars` ADD CONSTRAINT `prod_vars_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `prop_values` ADD CONSTRAINT `prop_values_property_id_prod_props_id_fk` FOREIGN KEY (`property_id`) REFERENCES `prod_props`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `prod_prop_assoc` ADD CONSTRAINT `prod_prop_assoc_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `prod_prop_assoc` ADD CONSTRAINT `prod_prop_assoc_property_id_prod_props_id_fk` FOREIGN KEY (`property_id`) REFERENCES `prod_props`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `var_prop_vals` ADD CONSTRAINT `var_prop_vals_property_id_prod_props_id_fk` FOREIGN KEY (`property_id`) REFERENCES `prod_props`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `var_prop_vals` ADD CONSTRAINT `var_prop_vals_value_id_prop_values_id_fk` FOREIGN KEY (`value_id`) REFERENCES `prop_values`(`id`) ON DELETE cascade ON UPDATE no action;