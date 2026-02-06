import { MigrationInterface, QueryRunner } from "typeorm";

export class MakePriceUserIdNullable_1709800000005 implements MigrationInterface {
    name = 'MakePriceUserIdNullable_1709800000005'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "price" ALTER COLUMN "userId" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Warning: This down migration might fail if there are rows with NULL userId
        // We usually don't revert constraints like this in MVP unless we clean data first
        await queryRunner.query(`DELETE FROM "price" WHERE "userId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "price" ALTER COLUMN "userId" SET NOT NULL`);
    }
}
