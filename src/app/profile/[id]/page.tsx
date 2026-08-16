import { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import ProfileClientView, { ProfileModel } from "./ProfileClientView";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getModelData(id: string): Promise<ProfileModel | null> {
  try {
    const { data, error } = await supabase
      .from("models")
      .select("id, name, age, city, sector, description, images, tags, plan_type, whatsapp, is_verified_4k, is_online")
      .eq("id", id)
      .single();

    if (data && !error) {
      return {
        id: data.id,
        name: data.name,
        age: data.age,
        location: data.sector ? `${data.sector}, ${data.city}` : data.city,
        description: data.description || "",
        images: data.images?.length ? data.images : ["https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800"],
        tags: data.tags || [],
        plan_type: data.plan_type,
        whatsapp: data.whatsapp,
        isVerified: data.is_verified_4k,
        is_verified_4k: data.is_verified_4k,
        is_online: data.is_online,
        city: data.city,
        sector: data.sector || undefined,
      };
    }
  } catch (err) {
    console.warn("Server-side model fetch fallback:", err);
  }
  return null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const model = await getModelData(id);

  if (!model) {
    return {
      title: "Perfil VIP | Cariñosas.top Elite",
      description: "Directorio de acompañantes de lujo y modelos 4K verificadas.",
    };
  }

  const title = `${model.name} (${model.location}) | Perfil VIP Verificado 4K · Cariñosas.top`;
  const cleanDescription = model.description 
    ? `${model.description.slice(0, 150)}... Fotos 100% reales, verificación 4K y contacto directo en ${model.location}.`
    : `Perfil exclusivo de ${model.name} en ${model.location}. Acompañante VIP 4K verificada en Cariñosas.top.`;

  const primaryImage = model.images[0] || "https://carinosas.top/og-luxury.png";

  return {
    title,
    description: cleanDescription,
    keywords: [
      model.name,
      `${model.name} ${model.city}`,
      `Acompañantes ${model.city}`,
      `Modelos VIP ${model.city}`,
      ...(model.tags || [])
    ],
    alternates: {
      canonical: `https://carinosas.top/profile/${id}`,
    },
    openGraph: {
      title,
      description: cleanDescription,
      url: `https://carinosas.top/profile/${id}`,
      siteName: "Cariñosas.top Elite",
      images: [
        {
          url: primaryImage,
          width: 800,
          height: 1000,
          alt: `Foto 4K verificada de ${model.name} en ${model.location}`,
        },
      ],
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: cleanDescription,
      images: [primaryImage],
    },
  };
}

export default async function DynamicProfilePage({ params }: PageProps) {
  const { id } = await params;
  const model = await getModelData(id);

  const jsonLd = model ? {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "mainEntity": {
      "@type": "Person",
      "name": model.name,
      "description": model.description,
      "image": model.images,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": model.city,
        "addressRegion": model.sector || model.city,
        "addressCountry": "EC"
      },
      "knowsAbout": model.tags,
      "award": model.is_verified_4k ? "Sello de Verificación Biométrica 4K" : "Perfil Élite Verificado"
    }
  } : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProfileClientView id={id} initialModel={model} />
    </>
  );
}
