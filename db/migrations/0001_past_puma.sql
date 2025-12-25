ALTER TABLE "chats" ALTER COLUMN "module_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "chats" ADD COLUMN "settings" jsonb;--> statement-breakpoint
ALTER TABLE "chats" ADD COLUMN "summary" text;