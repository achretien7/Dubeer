import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1709740000000 implements MigrationInterface {
    name = 'Init1709740000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "postgis"`);
        await queryRunner.query(`CREATE TABLE "venue" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "address" character varying, "city_area" character varying, "location" geography(Point,4326) NOT NULL, CONSTRAINT "PK_venue_id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_venue_location" ON "venue" USING GiST ("location")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_venue_location"`);
        await queryRunner.query(`DROP TABLE "venue"`);
    }
}
