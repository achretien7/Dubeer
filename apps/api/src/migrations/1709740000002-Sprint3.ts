import { MigrationInterface, QueryRunner } from "typeorm";

export class Sprint3_Trust1709740000002 implements MigrationInterface {
    name = 'Sprint3_Trust1709740000002'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add score to price
        await queryRunner.query(`ALTER TABLE "price" ADD "score" integer NOT NULL DEFAULT '0'`);

        // Create vote table
        await queryRunner.query(`CREATE TABLE "vote" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "value" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "priceId" uuid, CONSTRAINT "UQ_vote_user_price" UNIQUE ("userId", "priceId"), CONSTRAINT "PK_2d15e8d5f4df33f21915fa8b7a6" PRIMARY KEY ("id"))`);

        // Relations
        await queryRunner.query(`ALTER TABLE "vote" ADD CONSTRAINT "FK_vote_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vote" ADD CONSTRAINT "FK_vote_price" FOREIGN KEY ("priceId") REFERENCES "price"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vote" DROP CONSTRAINT "FK_vote_price"`);
        await queryRunner.query(`ALTER TABLE "vote" DROP CONSTRAINT "FK_vote_user"`);
        await queryRunner.query(`DROP TABLE "vote"`);
        await queryRunner.query(`ALTER TABLE "price" DROP COLUMN "score"`);
    }
}
