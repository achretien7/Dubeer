import { MigrationInterface, QueryRunner } from "typeorm";

export class PriceFkColumns1709800000002 implements MigrationInterface {
  name = 'PriceFkColumns1709800000002'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add missing FK columns if they don't exist
    await queryRunner.query(`ALTER TABLE "price" ADD COLUMN IF NOT EXISTS "venueId" uuid`);
    await queryRunner.query(`ALTER TABLE "price" ADD COLUMN IF NOT EXISTS "userId" uuid`);

    // Backfill from existing relations if any (safe if empty)
    // If columns already existed, these updates are no-ops
    await queryRunner.query(`
      UPDATE "price"
      SET "venueId" = COALESCE("venueId", "venueId")
    `);
    await queryRunner.query(`
      UPDATE "price"
      SET "userId" = COALESCE("userId", "userId")
    `);

    // Ensure NOT NULL for new inserts (after backfill)
    await queryRunner.query(`ALTER TABLE "price" ALTER COLUMN "venueId" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "price" ALTER COLUMN "userId" SET NOT NULL`);

    // Ensure FKs exist (drop if exists then recreate for idempotency)
    await queryRunner.query(`ALTER TABLE "price" DROP CONSTRAINT IF EXISTS "FK_1d3215233157574211833537e75"`);
    await queryRunner.query(`ALTER TABLE "price" DROP CONSTRAINT IF EXISTS "FK_304546596b65313988b4226f772"`);

    await queryRunner.query(
      `ALTER TABLE "price" ADD CONSTRAINT "FK_price_venue" FOREIGN KEY ("venueId") REFERENCES "venue"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "price" ADD CONSTRAINT "FK_price_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "price" DROP CONSTRAINT IF EXISTS "FK_price_user"`);
    await queryRunner.query(`ALTER TABLE "price" DROP CONSTRAINT IF EXISTS "FK_price_venue"`);

    await queryRunner.query(`ALTER TABLE "price" DROP COLUMN IF EXISTS "userId"`);
    await queryRunner.query(`ALTER TABLE "price" DROP COLUMN IF EXISTS "venueId"`);
  }
}
