import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Hakkında – Tally",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-[var(--text-primary)] p-6 font-sans">
      <div className="max-w-md mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-8 mt-2"
        >
          ← Geri
        </Link>

        <div className="flex items-center gap-1.5 mb-6">
          <span className="w-2.5 h-2.5 rounded-full border-2 border-[var(--accent)]" />
          <span className="text-sm font-semibold tracking-tight">Tally</span>
        </div>

        <div className="space-y-6 text-sm text-[var(--text-muted)] leading-relaxed">
          <section>
            <h1 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
              Tally nedir?
            </h1>
            <p>
              Tally, aboneliklerini, taksitlerini ve diğer aylık giderlerini tek yerde
              topladığın, gelirinden ne kadar geriye kaldığını net şekilde gördüğün basit
              bir kişisel finans uygulaması. Karmaşık bütçe tabloları yerine tek bakışta
              anlaşılan bir özet sunmayı hedefler.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">
              Verilerinin güvenliği
            </h2>
            <p>
              Girdiğin tüm veriler yalnızca senin hesabına bağlı olarak saklanır; başka
              hiçbir kullanıcı, satır bazlı güvenlik kuralları (Row Level Security)
              sayesinde senin verilerine erişemez. Tally verilerini reklam amacıyla
              kullanmaz veya üçüncü taraflarla paylaşmaz.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">
              Nasıl çalışır?
            </h2>
            <p>
              Giderlerini (abonelik, taksit ya da tek seferlik ödeme) ve aylık net
              gelirini elle giriyorsun. Tally aradaki farkı hesaplayıp güncel durumunu
              ve gelecek aylardaki tahmini durumunu gösteriyor. Banka hesabına
              bağlanmaz, kart bilgisi istemez — tamamen senin girdiğin verilerle
              çalışır.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">
              Geri bildirim
            </h2>
            <p>
              Bir hata bulursan ya da aklına iyi bir fikir gelirse, uygulamayı
              geliştirmeye devam ediyoruz — geri bildirimlerin değerli.{" "}
              <a
                href="mailto:gettally@proton.me"
                className="text-[var(--text-primary)] underline underline-offset-2 hover:text-[var(--accent)] transition-colors"
              >
                gettally@proton.me
              </a>{" "}
              adresine yazabilirsin.
            </p>
          </section>
        </div>

        <div className="mt-10">
          <Footer />
        </div>
      </div>
    </div>
  );
}
