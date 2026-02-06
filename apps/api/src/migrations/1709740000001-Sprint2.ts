import { MigrationInterface, QueryRunner } from "typeorm";

export class Sprint2_AuthPrices1709740000001 implements MigrationInterface {
    name = 'Sprint2_AuthPrices1709740000001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Users Table
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying, "provider" character varying NOT NULL, "providerId" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);

        // Prices Table
        await queryRunner.query(`CREATE TABLE "price" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" numeric NOT NULL, "currency" character varying NOT NULL DEFAULT 'AED', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "venueId" uuid, "userId" uuid, CONSTRAINT "PK_d163e55e8cce6908b6e0fbb38f5" PRIMARY KEY ("id"))`);

        // Relations
        await queryRunner.query(`ALTER TABLE "price" ADD CONSTRAINT "FK_1d3215233157574211833537e75" FOREIGN KEY ("venueId") REFERENCES "venue"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "price" ADD CONSTRAINT "FK_304546596b65313988b4226f772" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "price" DROP CONSTRAINT "FK_304546596b65313988b4226f772"`);
        await queryRunner.query(`ALTER TABLE "price" DROP CONSTRAINT "FK_1d3215233157574211833537e75"`);
        await queryRunner.query(`DROP TABLE "price"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }
}
