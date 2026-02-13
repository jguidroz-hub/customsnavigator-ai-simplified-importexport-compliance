import { pgTable, text, timestamp, boolean, integer, jsonb, index } from 'drizzle-orm/pg-core';
import { users } from './schema';

// Per-user preferences and settings
export const userSettings = pgTable('user_settings', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  timezone: text('timezone').default('UTC'),
  emailNotifications: boolean('email_notifications').default(true),
  weeklyDigest: boolean('weekly_digest').default(true),
  createdAt: timestamp('created_at').notNull().default(now()),
  updatedAt: timestamp('updated_at').notNull().default(now()),
});

// Tracks important state changes for debugging and compliance
export const auditLog = pgTable('audit_log', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
  action: text('action').notNull(),
  entityType: text('entity_type').notNull(),
  entityId: text('entity_id'),
  metadata: jsonb('metadata'),
  ipAddress: text('ip_address'),
  createdAt: timestamp('created_at').notNull().default(now()),
});

// Track product import/export compliance documents
export const customsDeclarations = pgTable('customs_declarations', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  productName: text('product_name').notNull(),
  hsCode: text('hs_code').notNull(),
  originCountry: text('origin_country').notNull(),
  destinationCountry: text('destination_country').notNull(),
  complianceStatus: text('compliance_status').default('pending'),
  riskScore: integer('risk_score').default(0),
  declarationDetails: jsonb('declaration_details'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});

// AI-generated compliance analysis reports
export const complianceReports = pgTable('compliance_reports', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  declarationId: text('declaration_id').references(() => customsDeclarations.id, { onDelete: 'cascade' }),
  recommendations: jsonb('recommendations').notNull(),
  tariffEstimate: text('tariff_estimate').notNull(),
  complianceRisk: text('compliance_risk').notNull(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});
