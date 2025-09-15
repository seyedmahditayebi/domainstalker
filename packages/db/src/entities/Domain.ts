import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Scan } from "./Scan";

@Index("domain_pkey", ["id"], { unique: true })
@Index("domain_name_key", ["name"], { unique: true })
@Entity("domain", { schema: "public" })
export class Domain {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("character varying", { name: "name", unique: true, length: 256 })
  name: string;

  @Column("timestamp without time zone", {
    name: "created_at",
    default: () => "now()",
  })
  createdAt: Date;

  @Column("text", { name: "total_subdomains", nullable: true })
  totalSubdomains: string | null;

  @Column("interval", { name: "scan_interval", nullable: true })
  scanInterval: any | null;

  @Column("timestamp without time zone", { name: "next_scan", nullable: true })
  nextScan: Date | null;

  @Column("enum", {
    name: "status",
    nullable: true,
    enum: ["scanning", "scheduled", "not-scheduled"],
  })
  status: "scanning" | "scheduled" | "not-scheduled" | null;

  @OneToMany(() => Scan, (scan) => scan.domain)
  scans: Scan[];
}
