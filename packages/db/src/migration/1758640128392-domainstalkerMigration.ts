import { MigrationInterface, QueryRunner } from 'typeorm';

export class DomainstalkerMigration1758640128392 implements MigrationInterface {
  name = 'DomainstalkerMigration1758640128392';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "scan" ("id" BIGSERIAL NOT NULL, "started_at" TIMESTAMP WITH TIME ZONE NOT NULL, "finished_at" TIMESTAMP WITH TIME ZONE NOT NULL, "discovered_subdomains" text, "domain_id" bigint, CONSTRAINT "PK_9868a638d0569ba3fe3bddcef84" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "scan_pkey" ON "scan" ("id") `
    );
    await queryRunner.query(
      `CREATE TYPE "public"."domain_status_enum" AS ENUM('scanning', 'scheduled', 'not-scheduled')`
    );
    await queryRunner.query(
      `CREATE TABLE "domain" ("id" BIGSERIAL NOT NULL, "name" character varying(256) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "total_subdomains" text, "scan_interval" interval NOT NULL, "next_scan" TIMESTAMP WITH TIME ZONE, "status" "public"."domain_status_enum", CONSTRAINT "UQ_26a07113f90df161f919c7d5a65" UNIQUE ("name"), CONSTRAINT "PK_27e3ec3ea0ae02c8c5bceab3ba9" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "domain_name_key" ON "domain" ("name") `
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "domain_pkey" ON "domain" ("id") `
    );
    await queryRunner.query(
      `ALTER TABLE "scan" ADD CONSTRAINT "FK_2b16679f30e39bcca3767f682b9" FOREIGN KEY ("domain_id") REFERENCES "domain"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "scan" DROP CONSTRAINT "FK_2b16679f30e39bcca3767f682b9"`
    );
    await queryRunner.query(`DROP INDEX "public"."domain_pkey"`);
    await queryRunner.query(`DROP INDEX "public"."domain_name_key"`);
    await queryRunner.query(`DROP TABLE "domain"`);
    await queryRunner.query(`DROP TYPE "public"."domain_status_enum"`);
    await queryRunner.query(`DROP INDEX "public"."scan_pkey"`);
    await queryRunner.query(`DROP TABLE "scan"`);
  }
}
