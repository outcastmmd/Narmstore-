CREATE TABLE "app_categories" (
	"app_id" text NOT NULL,
	"category_id" text NOT NULL,
	CONSTRAINT "app_categories_app_id_category_id_pk" PRIMARY KEY("app_id","category_id")
);
--> statement-breakpoint
CREATE TABLE "app_permissions" (
	"id" text PRIMARY KEY NOT NULL,
	"version_id" text NOT NULL,
	"permission" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app_screenshots" (
	"id" text PRIMARY KEY NOT NULL,
	"app_id" text NOT NULL,
	"url" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app_tags" (
	"app_id" text NOT NULL,
	"tag_id" text NOT NULL,
	CONSTRAINT "app_tags_app_id_tag_id_pk" PRIMARY KEY("app_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "app_versions" (
	"id" text PRIMARY KEY NOT NULL,
	"app_id" text NOT NULL,
	"version_name" varchar(64) NOT NULL,
	"version_code" integer NOT NULL,
	"file_url" text NOT NULL,
	"file_size" bigint,
	"sha256" varchar(128),
	"min_sdk" integer,
	"file_type" varchar(16) DEFAULT 'apk' NOT NULL,
	"changelog" text,
	"status" varchar(32) DEFAULT 'pending' NOT NULL,
	"is_current" boolean DEFAULT false NOT NULL,
	"source" text,
	"verified_at" timestamp,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "apps" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" varchar(255) NOT NULL,
	"package_name" varchar(255) NOT NULL,
	"name_fa" varchar(255) NOT NULL,
	"name_en" varchar(255) NOT NULL,
	"icon_url" text,
	"short_desc" text,
	"description" text,
	"developer_id" text,
	"license" varchar(128),
	"is_open_source" boolean DEFAULT false NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"editor_choice" boolean DEFAULT false NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"source_type" varchar(32) DEFAULT 'internal' NOT NULL,
	"source_url" text,
	"external_id" varchar(255),
	"min_sdk" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "apps_slug_unique" UNIQUE("slug"),
	CONSTRAINT "apps_package_name_unique" UNIQUE("package_name")
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"action" varchar(128) NOT NULL,
	"entity" varchar(64),
	"entity_id" text,
	"meta" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" varchar(128) NOT NULL,
	"name_fa" varchar(255) NOT NULL,
	"name_en" varchar(255),
	"description" text,
	"icon" varchar(64),
	"parent_id" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "content_pages" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" varchar(128) NOT NULL,
	"title" varchar(255) NOT NULL,
	"body" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "content_pages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "developers" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"website" text,
	"email" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "download_events" (
	"id" text PRIMARY KEY NOT NULL,
	"app_id" text NOT NULL,
	"version_id" text,
	"ip_hash" varchar(128) NOT NULL,
	"user_agent" text,
	"user_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "favorites" (
	"user_id" text NOT NULL,
	"app_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "favorites_user_id_app_id_pk" PRIMARY KEY("user_id","app_id")
);
--> statement-breakpoint
CREATE TABLE "news_articles" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"summary" text,
	"body" text NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "news_articles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "reports" (
	"id" text PRIMARY KEY NOT NULL,
	"app_id" text NOT NULL,
	"version_id" text,
	"user_id" text,
	"type" varchar(64) NOT NULL,
	"message" text NOT NULL,
	"status" varchar(32) DEFAULT 'open' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "repositories" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"url" text NOT NULL,
	"type" varchar(32) DEFAULT 'fdroid' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_sync_at" timestamp,
	"last_sync_status" varchar(64),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "repository_sync_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"repository_id" text NOT NULL,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"finished_at" timestamp,
	"status" varchar(32) DEFAULT 'running' NOT NULL,
	"message" text,
	"apps_added" integer DEFAULT 0 NOT NULL,
	"apps_updated" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" text PRIMARY KEY NOT NULL,
	"app_id" text NOT NULL,
	"user_id" text NOT NULL,
	"rating" integer NOT NULL,
	"text" text,
	"status" varchar(32) DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(64) NOT NULL,
	"name_fa" varchar(128) NOT NULL,
	"permissions" text[] DEFAULT '{}' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "roles_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"key" varchar(128) PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" varchar(128) NOT NULL,
	"name_fa" varchar(255) NOT NULL,
	CONSTRAINT "tags_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255),
	"password_hash" text NOT NULL,
	"role_id" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "app_categories" ADD CONSTRAINT "app_categories_app_id_apps_id_fk" FOREIGN KEY ("app_id") REFERENCES "public"."apps"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app_categories" ADD CONSTRAINT "app_categories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app_permissions" ADD CONSTRAINT "app_permissions_version_id_app_versions_id_fk" FOREIGN KEY ("version_id") REFERENCES "public"."app_versions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app_screenshots" ADD CONSTRAINT "app_screenshots_app_id_apps_id_fk" FOREIGN KEY ("app_id") REFERENCES "public"."apps"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app_tags" ADD CONSTRAINT "app_tags_app_id_apps_id_fk" FOREIGN KEY ("app_id") REFERENCES "public"."apps"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app_tags" ADD CONSTRAINT "app_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app_versions" ADD CONSTRAINT "app_versions_app_id_apps_id_fk" FOREIGN KEY ("app_id") REFERENCES "public"."apps"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "apps" ADD CONSTRAINT "apps_developer_id_developers_id_fk" FOREIGN KEY ("developer_id") REFERENCES "public"."developers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "download_events" ADD CONSTRAINT "download_events_app_id_apps_id_fk" FOREIGN KEY ("app_id") REFERENCES "public"."apps"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "download_events" ADD CONSTRAINT "download_events_version_id_app_versions_id_fk" FOREIGN KEY ("version_id") REFERENCES "public"."app_versions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_app_id_apps_id_fk" FOREIGN KEY ("app_id") REFERENCES "public"."apps"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_app_id_apps_id_fk" FOREIGN KEY ("app_id") REFERENCES "public"."apps"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "repository_sync_logs" ADD CONSTRAINT "repository_sync_logs_repository_id_repositories_id_fk" FOREIGN KEY ("repository_id") REFERENCES "public"."repositories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_app_id_apps_id_fk" FOREIGN KEY ("app_id") REFERENCES "public"."apps"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "app_permissions_version_idx" ON "app_permissions" USING btree ("version_id");--> statement-breakpoint
CREATE INDEX "app_screenshots_app_idx" ON "app_screenshots" USING btree ("app_id");--> statement-breakpoint
CREATE UNIQUE INDEX "app_versions_app_code_uidx" ON "app_versions" USING btree ("app_id","version_code");--> statement-breakpoint
CREATE INDEX "app_versions_app_status_idx" ON "app_versions" USING btree ("app_id","status");--> statement-breakpoint
CREATE INDEX "app_versions_current_idx" ON "app_versions" USING btree ("is_current");--> statement-breakpoint
CREATE INDEX "apps_published_idx" ON "apps" USING btree ("is_published","updated_at");--> statement-breakpoint
CREATE INDEX "apps_featured_idx" ON "apps" USING btree ("featured");--> statement-breakpoint
CREATE INDEX "apps_editor_idx" ON "apps" USING btree ("editor_choice");--> statement-breakpoint
CREATE INDEX "apps_namefa_idx" ON "apps" USING btree ("name_fa");--> statement-breakpoint
CREATE INDEX "apps_nameen_idx" ON "apps" USING btree ("name_en");--> statement-breakpoint
CREATE INDEX "audit_created_idx" ON "audit_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "audit_entity_idx" ON "audit_logs" USING btree ("entity","entity_id");--> statement-breakpoint
CREATE INDEX "categories_parent_idx" ON "categories" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "categories_active_idx" ON "categories" USING btree ("is_active","sort_order");--> statement-breakpoint
CREATE INDEX "developers_name_idx" ON "developers" USING btree ("name");--> statement-breakpoint
CREATE INDEX "dl_app_created_idx" ON "download_events" USING btree ("app_id","created_at");--> statement-breakpoint
CREATE INDEX "dl_iphash_created_idx" ON "download_events" USING btree ("ip_hash","created_at");--> statement-breakpoint
CREATE INDEX "news_published_idx" ON "news_articles" USING btree ("is_published","published_at");--> statement-breakpoint
CREATE INDEX "reports_status_created_idx" ON "reports" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "sync_repo_started_idx" ON "repository_sync_logs" USING btree ("repository_id","started_at");--> statement-breakpoint
CREATE UNIQUE INDEX "reviews_app_user_uidx" ON "reviews" USING btree ("app_id","user_id");--> statement-breakpoint
CREATE INDEX "reviews_app_status_idx" ON "reviews" USING btree ("app_id","status");--> statement-breakpoint
CREATE INDEX "users_role_idx" ON "users" USING btree ("role_id");