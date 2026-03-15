import ModelProfile from "@/components/ModelProfile";

const MOCK_MODEL = {
  name: "Valentina",
  age: 23,
  location: "Quito, La Carolina",
  description: "Elegancia y discreción absoluta para caballeros de gustos exigentes. Una experiencia única en la capital.",
  images: [
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=1200",
  ],
  services: ["Masajes Pro", "Trato de Novia", "Lencería Fina", "Cena Romántica", "Acompañante VIP"],
  isVerified: true,
};

export default function ProfilePage() {
  return (
    <main>
      <ModelProfile model={MOCK_MODEL} />
    </main>
  );
}
