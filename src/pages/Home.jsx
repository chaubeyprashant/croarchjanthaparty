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
        Every public contract above ₹10 lakh will be published in a live dashboard with vendor name,
        bid details, and delivery status. No file will hide behind &ldquo;technical reasons.&rdquo;
      </>
    ),
  },
  {
    number: '02',
    text: (
      <>
        We will launch a nationwide <mark>Public Complaint & Corruption Tracking System</mark> with
        mandatory status timelines for every registered grievance.
      </>
    ),
  },
  {
    number: '03',
    text: (
      <>
        50% representation for women in local leadership councils, party committees, and candidate
        shortlists — not as token faces, but as decision-makers.
      </>
    ),
  },
  {
    number: '04',
    text: (
      <>
        Annual district-level youth budget hearings will be compulsory, and every rupee approved
        for education, jobs, and skilling will be trackable in public view.
      </>
    ),
  },
  {
    number: '05',
    text: (
      <>
        Defection for political profit will trigger automatic disqualification and a six-year ban
        from contesting elections under a strict anti-defection reform law.
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
                Donations are temporarily paused while we migrate payment infrastructure.
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
