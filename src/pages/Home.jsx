import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Reveal } from '../components/Reveal.jsx'
import { Logo } from '../components/Logo.jsx'
import { Seo } from '../components/Seo.jsx'
import { SITE_NAME, SITE_URL, absoluteUrl } from '../lib/site.js'

const manifestoItems = [
  {
    number: '01',
    icon: '💼',
    title: 'Jobs & Accountability',
    text: (
      <>
        Real data on unemployment. <mark>Real action</mark> — not rebrand slogans on ₹10 crore
        billboards funded by our taxes.
      </>
    ),
  },
  {
    number: '02',
    icon: '📚',
    title: 'Education Reform',
    text: (
      <>
        Full accountability on <mark>NEET paper leaks</mark>. Resign, Education Minister. Scrap CBSE
        rechecking fees immediately.
      </>
    ),
  },
  {
    number: '03',
    icon: '🎙️',
    title: 'Press Freedom',
    text: (
      <>
        A PM who faces real press. 12 years. <mark>Zero press conferences</mark>. Democracy means
        answering questions you didn&apos;t write.
      </>
    ),
  },
  {
    number: '04',
    icon: '⚖️',
    title: 'Judicial Dignity',
    text: (
      <>
        Citizens are not cockroaches. Not parasites. Unemployment is not a character flaw.{' '}
        <mark>Dignity is constitutional</mark>.
      </>
    ),
  },
  {
    number: '05',
    icon: '🔍',
    title: 'Transparency Now',
    text: (
      <>
        Where did <mark>PM CARES funds</mark> go? We ask loudly, in writing, repeatedly, with RTIs —
        until someone answers honestly.
      </>
    ),
  },
]

const originTimeline = [
  {
    date: '15 May 2026',
    text: 'CJI Surya Kant calls unemployed youth "cockroaches and parasites" in a Supreme Court hearing.',
  },
  {
    date: '16 May 2026',
    text: 'Abhijeet Dipke launches CJP on X. 40,000 followers in 48 hours. The party anthem goes live.',
  },
  {
    date: '18 May 2026',
    text: '80,000 sign-ups. TMC MPs Mahua Moitra and Kirti Azad endorse the movement publicly.',
  },
  {
    date: '21 May 2026',
    text: '1 lakh+ members. Reports of contesting the Bankipur Assembly by-election in Bihar emerge.',
  },
]

const eligibilityItems = [
  { req: '01', title: 'Unemployed', detail: "By force, by choice, or by principle. We don't ask." },
  { req: '02', title: 'Lazy', detail: 'Physically only. The brain may continue to spiral.' },
  {
    req: '03',
    title: 'Chronically online',
    detail: 'Minimum 11 hours a day, including bathroom breaks.',
  },
  {
    req: '04',
    title: 'Can rant professionally',
    detail:
      'As long as the content is sharp, honest, and points at something that actually matters.',
  },
]

export function Home() {
  const location = useLocation()
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: absoluteUrl('/'),
        description:
          'India\'s satirical people\'s movement. Five demands. Zero sponsors. Join the swarm.',
        inLanguage: 'en-IN',
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: SITE_NAME,
        alternateName: ['CJP', 'Cockroach Janata Party', 'कॉकरोच जनता पार्टी'],
        url: absoluteUrl('/'),
        logo: absoluteUrl('/favicon.svg'),
        image: absoluteUrl('/og-image.svg'),
        foundingDate: '2026-05-16',
        slogan: 'Main Bhi Cockroach — मैं भी कॉकरोच',
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is the Cockroach Janta Party?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'The Cockroach Janta Party (CJP) is a satirical online political movement in India that uses humour to comment on democracy and encourage civic participation.',
            },
          },
          {
            '@type': 'Question',
            name: 'What does Main Bhi Cockroach mean?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Main Bhi Cockroach (मैं भी कॉकरोच) means "I am also a cockroach." It is the rallying slogan symbolising the resilience of ordinary Indian citizens.',
            },
          },
          {
            '@type': 'Question',
            name: 'How do I join the Cockroach Janta Party?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'You can join for free by registering on the website. Create an account, join the community forum, and file civic complaints through the public complaint system.',
            },
          },
          {
            '@type': 'Question',
            name: 'What are the five demands of CJP?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Jobs & Accountability, Education Reform, Press Freedom, Judicial Dignity, and Transparency Now — including RTI accountability and NEET reform.',
            },
          },
        ],
      },
    ],
  }

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1)
      const tryScroll = () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      const timer = window.setTimeout(tryScroll, 50)
      return () => window.clearTimeout(timer)
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
    return undefined
  }, [location.hash, location.pathname])

  return (
    <>
      <Seo
        title="Main Bhi Cockroach — India's Satirical People's Movement"
        description="Cockroach Janta Party (CJP): five demands, zero sponsors, one stubborn swarm. Read the manifesto, join the community, and file civic complaints across India."
        keywords="Cockroach Janta Party, CJP India, Main Bhi Cockroach, मैं भी कॉकरोच, कॉकरोच जनता पार्टी, manifesto, youth movement India, political satire, civic complaints"
        canonicalPath="/"
        jsonLd={jsonLd}
      />
      <section className="hero section" id="top">
        <div className="hero-inner">
          <Reveal as="p" className="badge">
            <span className="pulse" aria-hidden="true" />
            Official Platform · Est. 16 May 2026
          </Reveal>
          <Reveal as="h1" delay={80}>
            Cockroach <em className="accent-orange">Janta</em>{' '}
            <em className="accent-green">Party.</em>
          </Reveal>
          <Reveal as="p" delay={160} className="lead">
            A party for the people the system forgot to count. Five demands. Zero sponsors. One
            stubborn swarm. They called us cockroaches. We made it our name.
          </Reveal>
          <Reveal delay={240} className="hero-actions">
            {/* <Link to="/donate" className="btn btn-primary">
              Donate to the Movement →
            </Link> */}
            <Link to="/complaints/new" className="btn btn-primary">
              Report a Civic Issue →
            </Link>
            <a
              href="#manifesto"
              className="btn btn-link"
              onClick={(event) => {
                event.preventDefault()
                document.getElementById('manifesto')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Read the Manifesto
            </a>
          </Reveal>
        </div>

        <Reveal delay={320} className="hero-stats">
          <div>
            <strong>2,04,000+</strong>
            <span>Members & counting</span>
          </div>
          <div>
            <strong>5</strong>
            <span>Demands. Non-negotiable.</span>
          </div>
          <div>
            <strong>0</strong>
            <span>Corporate sponsors. Ever.</span>
          </div>
        </Reveal>
      </section>

      <section className="poster section" aria-label="Official poster">
        <Reveal className="poster-frame">
          <div className="poster-top">
            <span>Official Poster · No. 001</span>
            <span aria-hidden="true">★ ★ ★</span>
          </div>
          <div className="poster-body">
            <div className="poster-leader" aria-hidden="true">
              <div className="poster-leader-figure" />
            </div>
            <div className="poster-copy">
              <Logo size={48} />
              <p className="poster-party">COCKROACH = JANTA PARTY =</p>
              <p className="poster-tag">Together, we survive.</p>
              <h2>
                STRONGER
                <span>TOGETHER</span>
              </h2>
              <span className="stamp">Approved</span>
            </div>
          </div>
          <div className="poster-values">
            <div>
              <span>🛡</span> Unity
            </div>
            <div>
              <span>✊</span> Resilience
            </div>
            <div>
              <span>↗</span> Progress
            </div>
          </div>
        </Reveal>
      </section>

      <section className="quote-strip">
        <p>Together · Resilient · Unstoppable</p>
        <blockquote>&ldquo;They tried to step on us. We came back.&rdquo;</blockquote>
      </section>

      <section id="origin" className="section origin">
        <div className="section-head">
          <Reveal as="h2">
            One Word Changed <em>Everything.</em>
          </Reveal>
          <Reveal as="p" delay={80}>
            On 15 May 2026, the Chief Justice of India compared unemployed youth to
            &ldquo;cockroaches&rdquo; in open court. Within 24 hours, a tweet became a movement.
          </Reveal>
        </div>

        <ol className="origin-timeline">
          {originTimeline.map((item, index) => (
            <Reveal as="li" className="origin-item" key={item.date} delay={index * 70}>
              <span className="origin-date">{item.date}</span>
              <p>{item.text}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      <section id="vision" className="section vision">
        <div className="section-head">
          <Reveal as="h2">
            Our Movement&apos;s <em>Vision.</em>
          </Reveal>
          <Reveal as="p" delay={80}>
            We are not here to set up another PM CARES, holiday in Davos on the taxpayer&apos;s
            salary slip, or rebrand corruption as &ldquo;strategic spending.&rdquo; We are here to
            ask — loudly, repeatedly, in writing — where the money went, who got the contracts, and
            why the youth are always the punchline.
          </Reveal>
        </div>

        <Reveal className="mission-card" delay={120}>
          <span className="mission-label">Our Mission</span>
          <p>
            Build a party for the young people who keep getting called lazy, chronically online,
            and — most recently — cockroaches. That&apos;s it. That&apos;s the mission. The rest is
            satire.
          </p>
        </Reveal>

        <Reveal className="propaganda-card" delay={180}>
          <div className="propaganda-figure" />
          <div>
            <p>COCKROACH = JANTA PARTY =</p>
            <h3>UNITY. SURVIVAL. RESISTANCE.</h3>
          </div>
        </Reveal>
      </section>

      <section id="manifesto" className="section manifesto">
        <div className="section-head light">
          <Reveal as="h2">
            Five Demands. <em>Zero Compromises.</em>
          </Reveal>
          <Reveal as="p" delay={80}>
            Read it once. Read it twice. Then send it to someone who needs to read it.
          </Reveal>
        </div>

        <ol className="manifesto-list">
          {manifestoItems.map((item, index) => (
            <Reveal as="li" key={item.number} delay={index * 60}>
              <span className="manifesto-number">
                {item.number} <span aria-hidden="true">{item.icon}</span>
              </span>
              <div>
                <h3 className="manifesto-title">{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      <section id="eligibility" className="section eligibility">
        <div className="section-head">
          <Reveal as="h2">
            Are you eligible <em>to join?</em>
          </Reveal>
          <Reveal as="p" delay={80}>
            We do not check religion, caste, or gender. We do, however, have four (4) standards.
          </Reveal>
        </div>

        <div className="req-list">
          {eligibilityItems.map((item, index) => (
            <Reveal as="article" className="req-card" key={item.req} delay={index * 80}>
              <span className="req-label">REQ / {item.req}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </div>
              <span className="req-check" aria-hidden="true">
                ✓
              </span>
            </Reveal>
          ))}
        </div>

        <Reveal className="eligibility-cta" delay={120}>
          <Link to="/community" className="btn btn-primary">
            Join the Conversation →
          </Link>
          <p>
            Membership is free, lifelong, and revocable only by you. No fees. No selfies with the
            leader. No &ldquo;missed call to register.&rdquo;
          </p>
        </Reveal>
      </section>

      <section id="contact" className="section contact">
        <div className="contact-grid">
          <Reveal>
            <h2>
              Connect <em>with us.</em>
            </h2>
            <p>
              Want to join, volunteer, complain, or send a meme? Reach out. We read everything. We
              reply to most things.
            </p>

            <ul className="contact-list">
              <li>
                <span>Email</span>
                <a href="mailto:contact@cockroachjanthaparty.com">
                  contact@cockroachjanthaparty.com
                </a>
              </li>
              <li>
                <span>Press</span>
                <a href="mailto:contact@cockroachjanthaparty.com">
                  contact@cockroachjanthaparty.com
                </a>
              </li>
              <li>
                <span>Headquarters</span>
                <strong>Wherever the wifi works.</strong>
              </li>
            </ul>
          </Reveal>

          <Reveal className="contact-cta" delay={120}>
            <h3>Three ways to engage.</h3>
            <ul>
              <li>
                Donations are temporarily paused while we migrate payment infrastructure.
              </li>
              <li>
                <Link to="/community">Join the forum</Link> — discuss, upvote, and shape the next
                campaign.
              </li>
              <li>
                <a href="mailto:contact@cockroachjanthaparty.com">Volunteer</a> — write, design,
                organize, or just send a meme.
              </li>
            </ul>
          </Reveal>
        </div>
      </section>
    </>
  )
}
