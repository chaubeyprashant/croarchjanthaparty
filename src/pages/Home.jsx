import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Reveal } from '../components/Reveal.jsx'
import { Logo } from '../components/Logo.jsx'
import { Seo } from '../components/Seo.jsx'

const manifestoItems = [
  {
    number: '01',
    text: (
      <>
        If the CJP comes in power, no Chief Justice shall be granted a{' '}
        <mark>Rajya Sabha seat</mark> as a post-retirement reward.
      </>
    ),
  },
  {
    number: '02',
    text: (
      <>
        If any legit vote is deleted, whether in a CJP or opposition-ruled state, the{' '}
        <mark>CEC shall be arrested under UAPA</mark>, as taking away voting rights of citizens
        is no less than terrorism.
      </>
    ),
  },
  {
    number: '03',
    text: (
      <>
        Women shall receive <mark>50% reservation, not 33%</mark>, without increasing the strength
        of Parliament. Additionally, <mark>50% of all Cabinet positions</mark> shall be reserved
        for women.
      </>
    ),
  },
  {
    number: '04',
    text: (
      <>
        All media houses owned by{' '}
        <mark>Ambani and Adani shall have their licences cancelled</mark> to make way for truly
        independent media. Bank accounts of Godi media anchors shall be investigated.
      </>
    ),
  },
  {
    number: '05',
    text: (
      <>
        Any MLA or MP who defects from one party to another shall be barred from contesting
        elections — and from holding any public office — for a period of <mark>20 years</mark>.
      </>
    ),
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
    '@type': 'WebSite',
    name: 'Cockroach Janta Party',
    url: 'https://cockroachjantaparty.org/',
    description:
      'A youth-led political movement for the people the system forgot to count. Five demands. Zero sponsors.',
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
        title="Voice of the Lazy & Unemployed"
        description="A youth-led political movement for the people the system forgot to count. Read the manifesto, join the community, and support independent grassroots action."
        keywords="Cockroach Janta Party, manifesto, youth movement India, political satire, grassroots politics"
        canonicalPath="/"
        jsonLd={jsonLd}
      />
      <section className="hero section" id="top">
        <div className="hero-inner">
          <Reveal as="p" className="badge">
            <span className="pulse" aria-hidden="true" />
            Party launch · Live since yesterday
          </Reveal>
          <Reveal as="h1" delay={80}>
            Voice of the <em className="accent-orange">Lazy &</em>{' '}
            <em className="accent-green">Unemployed.</em>
          </Reveal>
          <Reveal as="p" delay={160} className="lead">
            A political party for the people the system forgot to count. Five demands. Zero
            sponsors. One large, stubborn swarm.
          </Reveal>
          <Reveal delay={240} className="hero-actions">
            <Link to="/donate" className="btn btn-primary">
              Donate to the Movement →
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
            <strong>72,481</strong>
            <span>Members in 48 hours</span>
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
            The <em>Manifesto.</em>
          </Reveal>
          <Reveal as="p" delay={80}>
            Read it once. Read it twice. Then send it to someone who needs to read it.
          </Reveal>
        </div>

        <ol className="manifesto-list">
          {manifestoItems.map((item, index) => (
            <Reveal as="li" key={item.number} delay={index * 60}>
              <span className="manifesto-number">{item.number}</span>
              <p>{item.text}</p>
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

      <section id="founder" className="section founder">
        <Reveal className="founder-card">
          <div className="founder-photo" aria-hidden="true" />
          <div>
            <p className="founder-label">Founder</p>
            <h2>Abhijeet Dipke</h2>
            <p className="founder-role">Founder &amp; Convenor</p>
            <p>
              A political party for the lazy, the unemployed, and the chronically correct.
              Headquartered wherever the wifi works.
            </p>
          </div>
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
                <a href="mailto:contact@cockroachjantaparty.org">
                  contact@cockroachjantaparty.org
                </a>
              </li>
              <li>
                <span>Press</span>
                <a href="mailto:contact@cockroachjantaparty.org">
                  contact@cockroachjantaparty.org
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
                <Link to="/donate">Donate</Link> — keep us independent. Every rupee is logged and
                allocated transparently.
              </li>
              <li>
                <Link to="/community">Join the forum</Link> — discuss, upvote, and shape the next
                campaign.
              </li>
              <li>
                <a href="mailto:contact@cockroachjantaparty.org">Volunteer</a> — write, design,
                organize, or just send a meme.
              </li>
            </ul>
          </Reveal>
        </div>
      </section>
    </>
  )
}
