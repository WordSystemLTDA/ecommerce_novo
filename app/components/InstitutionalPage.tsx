import type { ReactNode } from "react";
import Footer from "./footer";
import Header from "./header";

interface InstitutionalPageProps {
    eyebrow: string;
    title: string;
    intro: string;
    children: ReactNode;
}

export function InstitutionalPage({ eyebrow, title, intro, children }: InstitutionalPageProps) {
    return (
        <div className="min-h-screen bg-main-bg text-primary">
            <Header />
            <main className="page-container py-8 sm:py-12 lg:py-16">
                <article className="mx-auto max-w-5xl">
                    <header className="border-b border-primary/10 pb-6 sm:pb-8">
                        <p className="overline-label">{eyebrow}</p>
                        <h1 className="mt-2 font-serif text-3xl font-medium tracking-tight sm:text-4xl lg:text-5xl">{title}</h1>
                        <p className="mt-4 max-w-3xl text-sm leading-7 text-primary/65 sm:text-base">{intro}</p>
                    </header>
                    <div className="mt-6 grid gap-4 sm:mt-8 sm:gap-5">{children}</div>
                </article>
            </main>
            <Footer />
        </div>
    );
}

export function InformationSection({ title, children }: { title: string; children: ReactNode }) {
    return (
        <section className="border border-primary/10 bg-product-bg p-5 shadow-[0_4px_20px_rgba(0,0,0,0.035)] sm:p-7">
            <h2 className="font-serif text-xl font-medium sm:text-2xl">{title}</h2>
            <div className="mt-3 space-y-3 text-sm leading-7 text-primary/65 sm:text-base">{children}</div>
        </section>
    );
}
