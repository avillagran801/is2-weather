-- DropForeignKey
ALTER TABLE "ActivityCategory" DROP CONSTRAINT "ActivityCategory_activity_id_fkey";

-- DropForeignKey
ALTER TABLE "ActivityCategory" DROP CONSTRAINT "ActivityCategory_category_id_fkey";

-- AddForeignKey
ALTER TABLE "ActivityCategory" ADD CONSTRAINT "ActivityCategory_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityCategory" ADD CONSTRAINT "ActivityCategory_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
