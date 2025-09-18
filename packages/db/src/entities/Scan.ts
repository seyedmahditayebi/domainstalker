import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Domain } from "./Domain";

@Index("scan_pkey", ["id"], { unique: true })
@Entity("scan", { schema: "public" })
export class Scan {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("timestamp with time zone", { name: "started_at" })
  startedAt: Date;

  @Column("timestamp with time zone", { name: "finished_at" })
  finishedAt: Date;

  @Column("text", { name: "discovered_subdomains", nullable: true })
  discoveredSubdomains: string | null;

  @ManyToOne(() => Domain, (domain) => domain.scans, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "domain_id", referencedColumnName: "id" }])
  domain: Domain;
}
