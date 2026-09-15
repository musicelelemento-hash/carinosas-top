"use server";

import { checkAdminSessionAction } from "./admin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export type RecruitmentStatus =
  | "new"
  | "contacted"
  | "interested"
  | "consented"
  | "profile_created"
  | "declined";

export interface RecruitmentLead {
  id: string;
  name: string;
  whatsapp: string;
  city: string;
  zone: string | null;
  status: RecruitmentStatus;
  source: string | null;
  consent_confirmed_at: string | null;
  notes: string | null;
  created_at: string;
}

const RECRUITMENT_STATUSES: readonly RecruitmentStatus[] = [
  "new",
  "contacted",
  "interested",
  "consented",
  "profile_created",
  "declined",
];

async function assertOperator() {
  const isAdmin = await checkAdminSessionAction();
  if (!isAdmin) throw new Error("No autorizado: Acceso denegado.");
}

function normalizeWhatsapp(raw: string): string {
  let cleaned = raw.replace(/[^0-9+]/g, "");
  if (cleaned.startsWith("+")) return cleaned;
  cleaned = cleaned.replace(/^0+/, "");
  if (!cleaned.startsWith("593")) return `+593${cleaned}`;
  return `+${cleaned}`;
}

function mapLead(row: any): RecruitmentLead {
  return {
    id: row.id,
    name: row.name,
    whatsapp: row.whatsapp,
    city: row.city,
    zone: row.zone || null,
    status: row.status,
    source: row.source || null,
    consent_confirmed_at: row.consent_confirmed_at || null,
    notes: row.notes || null,
    created_at: row.created_at,
  };
}

export async function addRecruitmentLeadAction(input: {
  name: string;
  whatsapp: string;
  city?: string;
  zone?: string;
  source?: string;
  notes?: string;
}): Promise<RecruitmentLead> {
  await assertOperator();

  const name = input.name?.trim();
  const whatsapp = normalizeWhatsapp(input.whatsapp || "");
  if (!name) throw new Error("El nombre del lead es obligatorio.");
  if (whatsapp.length < 8) throw new Error("El WhatsApp debe tener al menos 8 dígitos.");

  const { data, error } = await supabaseAdmin
    .from("recruitment_leads")
    .insert([
      {
        name,
        whatsapp,
        city: input.city?.trim() || "Machala",
        zone: input.zone?.trim() || null,
        status: "new",
        source: input.source?.trim() || "whatsapp",
        notes: input.notes?.trim() || null,
      },
    ])
    .select("*")
    .single();

  if (error) throw new Error(`Error al registrar el lead: ${error.message}`);
  return mapLead(data);
}

export async function updateLeadStatusAction(
  id: string,
  status: RecruitmentStatus,
  options?: { notes?: string }
): Promise<RecruitmentLead> {
  await assertOperator();
  if (!RECRUITMENT_STATUSES.includes(status)) {
    throw new Error("Estado de reclutamiento no válido.");
  }

  const { data: existing, error: fetchErr } = await supabaseAdmin
    .from("recruitment_leads")
    .select("notes, consent_confirmed_at")
    .eq("id", id)
    .single();
  if (fetchErr || !existing) throw new Error("No se encontró el lead.");

  const updatePayload: Record<string, unknown> = { status };

  if (status === "consented" && !existing.consent_confirmed_at) {
    updatePayload.consent_confirmed_at = new Date().toISOString();
  }

  if (options?.notes?.trim()) {
    const noteLine = `[${new Date().toISOString()}] ${options.notes.trim()}`;
    updatePayload.notes = existing.notes ? `${existing.notes}\n${noteLine}` : noteLine;
  }

  const { data, error } = await supabaseAdmin
    .from("recruitment_leads")
    .update(updatePayload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(`Error al actualizar el lead: ${error.message}`);
  return mapLead(data);
}

export async function listRecruitmentLeadsAction(): Promise<RecruitmentLead[]> {
  await assertOperator();

  const { data, error } = await supabaseAdmin
    .from("recruitment_leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Error al listar los leads: ${error.message}`);
  return (data || []).map(mapLead);
}