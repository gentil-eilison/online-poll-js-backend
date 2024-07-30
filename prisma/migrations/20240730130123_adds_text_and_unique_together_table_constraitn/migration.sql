/*
  Warnings:

  - A unique constraint covering the columns `[text,poll_id]` on the table `PollOption` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `text` to the `PollOption` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PollOption" ADD COLUMN     "text" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PollOption_text_poll_id_key" ON "PollOption"("text", "poll_id");
