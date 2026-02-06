import { MigrationInterface, QueryRunner } from "typeorm";

export class SprintA_PriceModel_1709740000003 implements MigrationInterface {
    name = 'SprintA_PriceModel_1709740000003'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Add new columns
        await queryRunner.query(`ALTER TABLE "price" ADD "amountCents" integer`);
        await queryRunner.query(`ALTER TABLE "price" ADD "beverageType" character varying NOT NULL DEFAULT 'beer'`);
        await queryRunner.query(`ALTER TABLE "price" ADD "format" character varying NOT NULL DEFAULT '50cl'`);
        await queryRunner.query(`ALTER TABLE "price" ALTER COLUMN "amount" DROP NOT NULL`);

        // 2. Backfill amountCents from amount (Safe Migration)
        // If amount is present, convert to cents (multiply by 100 and round)
        await queryRunner.query(`UPDATE "price" SET "amountCents" = ROUND("amount" * 100) WHERE "amount" IS NOT NULL`);

        // 3. Ensure defaults are populated for existing rows (defaults above handle this for new cols, but good to be explicit for types)
        await queryRunner.query(`UPDATE "price" SET "beverageType" = 'beer' WHERE "beverageType" IS NULL`);
        await queryRunner.query(`UPDATE "price" SET "format" = '50cl' WHERE "format" IS NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "price" DROP COLUMN "format"`);
        await queryRunner.query(`ALTER TABLE "price" DROP COLUMN "beverageType"`);
        await queryRunner.query(`ALTER TABLE "price" DROP COLUMN "amountCents"`);
        await queryRunner.query(`ALTER TABLE "price" ALTER COLUMN "amount" SET NOT NULL`);
    }
}
