-- DropForeignKey
ALTER TABLE `ContactGroup` DROP FOREIGN KEY `ContactGroup_contactId_fkey`;

-- DropForeignKey
ALTER TABLE `ContactGroup` DROP FOREIGN KEY `ContactGroup_groupId_fkey`;

-- CreateIndex
CREATE INDEX `Group_name_idx` ON `Group`(`name`);

-- AddForeignKey
ALTER TABLE `ContactGroup` ADD CONSTRAINT `ContactGroup_contactId_fkey` FOREIGN KEY (`contactId`) REFERENCES `Contact`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ContactGroup` ADD CONSTRAINT `ContactGroup_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `Group`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
