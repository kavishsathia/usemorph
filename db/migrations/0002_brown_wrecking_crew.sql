ALTER TABLE "windows" ADD COLUMN "window_tag" text NOT NULL;--> statement-breakpoint
ALTER TABLE "windows" ADD COLUMN "is_minimised" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "windows" ADD COLUMN "is_closed" boolean DEFAULT false NOT NULL;