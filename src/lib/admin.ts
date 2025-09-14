import { prisma } from "@/lib/db";

export async function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function upsertAudit(
  userId: string | undefined,
  action: string,
  entity: string,
  entityId: string,
  diff?: any
) {
  try {
    // Don't let logging ever block core actions
    await prisma.auditLog.create({ data: { userId, action, entity, entityId, diff } });
  } catch (e) {
    console.warn("[audit] skipped:", (e as any)?.code || (e as any)?.message || e);
  }
}
