import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation will be added in Phase 02 */}
      <header className="fixed top-0 left-0 right-0 z-50" style={{ background: 'rgba(255, 251, 245, 0.90)', borderBottom: '1px solid rgba(26, 20, 16, 0.08)' }}>
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8" style={{ padding: '14px 24px' }}>
          <div className="flex items-center justify-between">
            <Link href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: '#1A1410' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: '42px', height: '42px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #7A0C2E, #500A1F)',
                color: 'white', fontFamily: '"Inter", sans-serif',
                fontWeight: 700, fontSize: '15px', letterSpacing: '0.5px'
              }}>
                RA
              </span>
              <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                <strong style={{ fontFamily: '"Baloo Da 2", "Hind Siliguri", sans-serif', fontWeight: 700, fontSize: '1.05rem', color: '#1A1410' }}>
                  রাহাত আহমেদ
                </strong>
                <span style={{ fontFamily: '"Inter", sans-serif', fontSize: '10px', fontWeight: 500, color: '#7B6F63', letterSpacing: '1.5px', textTransform: 'uppercase', marginTop: '2px' }}>
                  Portfolio
                </span>
              </span>
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                padding: '10px 28px', borderRadius: '999px',
                background: 'linear-gradient(135deg, #7A0C2E, #500A1F)',
                color: 'white', fontFamily: '"Inter", sans-serif',
                fontSize: '1rem', fontWeight: 600,
                boxShadow: '0 12px 24px -10px rgba(122, 12, 46, 0.4)',
                textDecoration: 'none'
              }}>
                যোগাযোগ করুন
              </span>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="section section--lg min-h-screen flex items-center" id="home">
          <div className="container">
            <div className="flex flex-col items-center text-center gap-8">
              {/* Avatar */}
              <div className="relative">
                <div className="absolute inset-0 rounded-full border-2 border-primary opacity-50" style={{ animation: 'pulseRing 3s ease-out infinite' }}></div>
                <div className="absolute inset-[30px] rounded-full border-2 border-primary opacity-50" style={{ animation: 'pulseRing 3s ease-out infinite', animationDelay: '1.5s' }}></div>
                <div className="avatar avatar--xl avatar--bordered">
                  <img
                    src="/images/profile.jpg"
                    alt="Portrait of Rahat Ahmed"
                    width={220}
                    height={220}
                    className="w-full h-full object-cover rounded-full block"
                    fetchPriority="high"
                  />
                </div>
              </div>

              {/* Eyebrow */}
              <p className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm" style={{ background: 'rgba(122, 12, 46, 0.10)', color: '#7A0C2E', fontWeight: 500 }}>
                বিসমিল্লাহির রাহমানির রাহিম
              </p>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold" style={{ fontFamily: '"Baloo Da 2", "Hind Siliguri", sans-serif', lineHeight: 1.1, color: '#1A1410', margin: 0 }}>
                রাহাত আহমেদ
                <span className="block" style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.4em', fontWeight: 500, color: '#7A0C2E', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '8px' }}>
                  Rahat Ahmed
                </span>
              </h1>

              {/* Subtitle */}
              <p className="max-w-[600px] text-center" style={{ color: '#4A3F35', fontSize: '1.05rem', lineHeight: 1.8, margin: 0 }}>
                আমি একজন শিক্ষার্থী, শিক্ষক, রক্তদাতা, BNCC ক্যাডেট এবং উদীয়মান ওয়েব ডেভেলপার। শিক্ষা, সমাজসেবা ও প্রযুক্তির মাধ্যমে মানুষের পাশে দাঁড়ানোই আমার লক্ষ্য।
              </p>

              {/* Chips */}
              <div className="flex flex-wrap justify-center gap-3">
                <span className="chip">HSC শিক্ষার্থী</span>
                <span className="chip">শিক্ষক</span>
                <span className="chip" style={{ background: '#C1121F', color: 'white', borderColor: '#C1121F' }}>A+ রক্তদাতা</span>
                <span className="chip">BNCC ক্যাডেট</span>
                <span className="chip">ওয়েব ডেভেলপার</span>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <Link href="#achievements" className="btn btn--primary btn--lg">
                  আমার অর্জন দেখুন
                </Link>
                <Link href="#contact" className="btn btn--ghost btn--lg">
                  যোগাযোগ করুন
                </Link>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <span className="badge badge--gold">রক্তের গ্রুপ: A+</span>
                <span className="badge badge--success">৪ বার রক্তদান</span>
              </div>

              {/* Scroll Indicator */}
              <a href="#about" className="flex flex-col items-center gap-2 pt-8 text-[#7B6F63] text-xs uppercase tracking-[0.2em]" style={{ textDecoration: 'none' }}>
                নিচে দেখুন
                <div className="w-6 h-10 border-2 border-current rounded-full relative flex items-center justify-center pt-1">
                  <span className="w-1 h-2 bg-current rounded block" style={{ animation: 'scrollDot 1.8s ease-in-out infinite' }}></span>
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="section" id="about">
          <div className="container">
            <div className="section-header">
              <span className="section-header__eyebrow">পরিচয়</span>
              <h2 className="section-header__title">আমার সম্পর্কে</h2>
              <p className="section-header__subtitle">গ্রাম থেকে শহর, স্বপ্ন থেকে বাস্তব — একটি অবিরাম যাত্রার গল্প</p>
            </div>

            <div className="split split--2-3">
              <div className="flex flex-col">
                <div className="relative">
                  <div className="aspect aspect--3x4 rounded-[20px] overflow-hidden" style={{ boxShadow: '0 30px 60px -30px rgba(34, 26, 21, 0.35)', border: '4px solid white' }}>
                    <img
                      src="/images/profile.jpg"
                      alt="Rahat Ahmed at Sunamganj"
                      width={480}
                      height={640}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute -bottom-5 -right-3 bg-white p-4 rounded-full flex items-center gap-3 shadow-lg border" style={{ borderColor: 'rgba(26, 20, 16, 0.10)' }}>
                    <span style={{ fontSize: '1.8rem' }}>🎓</span>
                    <div>
                      <strong style={{ fontSize: '0.82rem', color: '#1A1410', fontWeight: 700 }}>HSC ২য় বর্ষ</strong>
                      <small style={{ fontSize: '0.72rem', color: '#7B6F63', display: 'block' }}>বিজ্ঞান বিভাগ</small>
                    </div>
                  </div>
                </div>
                <blockquote className="quote quote--gold mt-8">
                  মানুষের পাশে দাঁড়ানো, শেখা এবং শেখানো — এই তিনটি জিনিস আমাকে এগিয়ে নিয়ে যায়।
                </blockquote>
              </div>

              <div className="flex flex-col">
                <div className="space-y-6">
                  <p style={{ color: '#4A3F35', fontSize: '1rem', lineHeight: 1.8, margin: 0 }}>
                    আমি রাহাত আহমেদ। ২০০৬ সালের ২১ জুন সুনামগঞ্জ জেলার শান্তিগঞ্জ উপজেলার জীবদাড়া গ্রামে আমার জন্ম। প্রকৃতির কোলে বেড়ে ওঠা এই গ্রামই আমাকে শিখিয়েছে স্বপ্ন দেখতে এবং লড়াই করতে।
                  </p>
                  <p style={{ color: '#4A3F35', fontSize: '1rem', lineHeight: 1.8, margin: 0 }}>
                    বর্তমানে আমি সুনামগঞ্জ সরকারি কলেজে HSC ২য় বর্ষে বিজ্ঞান বিভাগের শিক্ষার্থী। পড়াশোনার পাশাপাশি আমি একজন গৃহশিক্ষক, শান্তিচক্র ব্লাড সোসাইটির সহ-প্রতিষ্ঠাতা ও সাধারণ সম্পাদক, FS কোচিং সেন্টারের প্রতিষ্ঠাতা এবং BNCC-এর একজন সক্রিয় ক্যাডেট।
                  </p>
                  <p style={{ color: '#4A3F35', fontSize: '1rem', lineHeight: 1.8, margin: 0 }}>
                    ওয়েব ডেভেলপমেন্ট, আর্টিফিশিয়াল ইন্টেলিজেন্স, কনটেন্ট ক্রিয়েশন এবং সামাজিক সেবা — এই বিষয়গুলো নিয়ে কাজ করতে ভালোবাসি। আমার লক্ষ্য শিক্ষা ও প্রযুক্তির মাধ্যমে সমাজে ইতিবাচক পরিবর্তন আনা।
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12 pt-12" style={{ borderTop: '1px solid rgba(26, 20, 16, 0.10)' }}>
                  {[
                    { icon: '📅', label: 'জন্ম তারিখ', value: '২১ জুন, ২০০৬' },
                    { icon: '📍', label: 'অবস্থান', value: 'সুনামগঞ্জ, বাংলাদেশ' },
                    { icon: '🩸', label: 'রক্তের গ্রুপ', value: 'A+ Positive' },
                    { icon: '🎖️', label: 'BNCC ক্যাডেট নম্বর', value: '25071152' },
                    { icon: '🎓', label: 'বর্তমান পড়াশোনা', value: 'HSC ২য় বর্ষ (বিজ্ঞান)' },
                    { icon: '🏫', label: 'প্রতিষ্ঠান', value: 'সুনামগঞ্জ সরকারি কলেজ' },
                    { icon: '🤝', label: 'ভূমিকা', value: 'সাধারণ সম্পাদক, শান্তিচক্র' },
                    { icon: '🌐', label: 'ভাষা', value: 'বাংলা, English' },
                  ].map((fact, index) => (
                    <div key={index} className="flex items-start gap-3 p-3" style={{ background: '#F3EEE4', borderRadius: '12px' }}>
                      <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{fact.icon}</span>
                      <div>
                        <span style={{ fontSize: '0.72rem', color: '#7B6F63', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, display: 'block' }}>{fact.label}</span>
                        <span style={{ fontSize: '0.82rem', color: '#1A1410', fontWeight: 500, lineHeight: 1.3, display: 'block' }}>{fact.value}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-12">
                  <Link href="#education" className="link link--arrow">
                    আমার শিক্ষাজীবন দেখুন
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Placeholder for remaining sections - will be built in subsequent phases */}
        <section className="section section--dark" id="education" style={{ opacity: 0.5, pointerEvents: 'none' }}>
          <div className="container">
            <div className="section-header">
              <span className="section-header__eyebrow">একাডেমিক যাত্রা</span>
              <h2 className="section-header__title">শিক্ষাজীবন <span style={{ color: '#7B6F63', fontSize: '0.5em', fontWeight: 400 }}>(Phase 05-এ তৈরি হবে)</span></h2>
            </div>
          </div>
        </section>

        <section className="section" id="achievements" style={{ opacity: 0.5, pointerEvents: 'none' }}>
          <div className="container">
            <div className="section-header">
              <span className="section-header__eyebrow">স্বীকৃতি ও পুরস্কার</span>
              <h2 className="section-header__title">অর্জনসমূহ <span style={{ color: '#7B6F63', fontSize: '0.5em', fontWeight: 400 }}>(Phase 06-এ তৈরি হবে)</span></h2>
            </div>
          </div>
        </section>

        <section className="section section--dark" id="experience" style={{ opacity: 0.5, pointerEvents: 'none' }}>
          <div className="container">
            <div className="section-header">
              <span className="section-header__eyebrow">কর্মজীবন ও উদ্যোগ</span>
              <h2 className="section-header__title">অভিজ্ঞতা ও প্রতিষ্ঠান <span style={{ color: '#7B6F63', fontSize: '0.5em', fontWeight: 400 }}>(Phase 07-এ তৈরি হবে)</span></h2>
            </div>
          </div>
        </section>

        <section className="section section--primary" id="blood" style={{ opacity: 0.5, pointerEvents: 'none' }}>
          <div className="container">
            <div className="section-header section-header--light">
              <span className="section-header__eyebrow">রক্তই জীবন</span>
              <h2 className="section-header__title">শান্তিচক্র ব্লাড সোসাইটি <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.5em', fontWeight: 400 }}>(Phase 08-এ তৈরি হবে)</span></h2>
            </div>
          </div>
        </section>

        <section className="section section--tribute" id="tribute" style={{ opacity: 0.5, pointerEvents: 'none' }}>
          <div className="container">
            <div className="section-header section-header--left">
              <span className="section-header__eyebrow" style={{ color: '#C99A3E', background: 'rgba(201, 154, 62, 0.1)' }}>স্মৃতিতে অম্লান</span>
              <h2 className="section-header__title" style={{ color: '#E8E0D5' }}>শ্রদ্ধাঞ্জলি <span style={{ color: 'rgba(232, 224, 213, 0.5)', fontSize: '0.5em', fontWeight: 400 }}>(Phase 09-এ তৈরি হবে)</span></h2>
            </div>
          </div>
        </section>

        <section className="section" id="gallery" style={{ opacity: 0.5, pointerEvents: 'none' }}>
          <div className="container">
            <div className="section-header">
              <span className="section-header__eyebrow">মুহূর্তগুলো</span>
              <h2 className="section-header__title">গ্যালারি <span style={{ color: '#7B6F63', fontSize: '0.5em', fontWeight: 400 }}>(Phase 10-এ তৈরি হবে)</span></h2>
            </div>
          </div>
        </section>

        <section className="section section--dark" id="contact" style={{ opacity: 0.5, pointerEvents: 'none' }}>
          <div className="container">
            <div className="section-header">
              <span className="section-header__eyebrow">চলুন কথা বলি</span>
              <h2 className="section-header__title">যোগাযোগ করুন <span style={{ color: '#7B6F63', fontSize: '0.5em', fontWeight: 400 }}>(Phase 11-এ তৈরি হবে)</span></h2>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Placeholder */}
      <footer style={{ background: '#F3EEE4', color: '#4A3F35', padding: 'clamp(48px, 8vw, 72px) 0 32px', borderTop: '1px solid rgba(26, 20, 16, 0.10)' }}>
        <div className="container">
          <div className="text-center">
            <p style={{ color: '#7B6F63', fontSize: '0.82rem' }}>
              © 2025 <strong>Rahat Ahmed</strong> · সর্বস্বত্ব সংরক্ষিত
            </p>
            <p style={{ color: '#8B7F73', fontSize: '0.72rem', marginTop: '4px' }}>
              সুনামগঞ্জ, বাংলাদেশ থেকে ❤️ দিয়ে তৈরি
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}