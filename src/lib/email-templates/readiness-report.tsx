import React from 'react'
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import { getCeoGap, getScoreBand } from '@/lib/scoreBand'
import type { TemplateEntry } from './registry'

interface Props {
  firstName?: string
  score?: number
  communicationType?: string
  gaps?: Array<string>
  sessionId?: string
}

const main = { backgroundColor: '#ffffff', fontFamily: 'Helvetica, Arial, sans-serif' }
const container = { maxWidth: '560px', margin: '0 auto', padding: '32px 24px' }
const eyebrow = {
  fontSize: '11px',
  letterSpacing: '0.22em',
  textTransform: 'uppercase' as const,
  color: '#6b7280',
  margin: '0 0 12px',
}
const h1 = { fontSize: '24px', lineHeight: '1.25', color: '#0b0b0f', margin: '0 0 20px' }
const scoreCard = {
  textAlign: 'center' as const,
  padding: '28px 20px',
  border: '1px solid #e5e7eb',
  borderRadius: '16px',
  backgroundColor: '#fafafa',
}
const scoreNum = { fontSize: '56px', lineHeight: '1', fontWeight: 700, color: '#0b0b0f', margin: 0 }
const body = { fontSize: '15px', lineHeight: '1.65', color: '#374151', margin: '0 0 16px' }
const h2 = { fontSize: '16px', color: '#0b0b0f', margin: '28px 0 10px' }
const cta = {
  backgroundColor: '#0b0b0f',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: 600,
  padding: '14px 26px',
  borderRadius: '999px',
  textDecoration: 'none',
  display: 'inline-block',
}
const small = { fontSize: '12px', color: '#6b7280', lineHeight: '1.6' }

const ReadinessReport = ({ firstName, score, communicationType, gaps, sessionId }: Props) => {
  const name = firstName?.trim() || 'there'
  const value = typeof score === 'number' ? score : 0
  const type = (communicationType || '').replace(/_/g, ' ').trim()
  const list = Array.isArray(gaps) ? gaps.filter(Boolean).slice(0, 5) : []
  const ceo = getCeoGap(value)
  const band = getScoreBand(value)
  const resultUrl = sessionId
    ? `https://www.bramwellai.com/diagnostic/result?id=${sessionId}`
    : 'https://www.bramwellai.com/program'

  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>{`Your Bramwell readiness score: ${value}/100`}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={eyebrow}>Bramwell AI</Text>
          <Heading style={h1}>{`Hi ${name}, here is your readiness score`}</Heading>

          <Section style={scoreCard}>
            <Text style={scoreNum}>
              {value}
              <span style={{ fontSize: '20px', color: '#6b7280', fontWeight: 400 }}>/100</span>
            </Text>
            <Text style={{ ...eyebrow, margin: '12px 0 0' }}>Communication readiness</Text>
          </Section>

          <Text style={body}>
            <strong>{ceo.atOrAbove ? 'At CEO benchmark' : `${ceo.gap} points from CEO level`}</strong>.{' '}
            {ceo.verdict}
          </Text>

          <Text style={body}>
            <strong>{band.label}.</strong> {band.meaning} Next: {band.next}
          </Text>

          {type ? (
            <>
              <Heading as="h2" style={h2}>
                How you come across
              </Heading>
              <Text style={{ ...body, textTransform: 'capitalize' }}>{type}</Text>
            </>
          ) : null}

          {list.length > 0 ? (
            <>
              <Heading as="h2" style={h2}>
                Your top gaps
              </Heading>
              {list.map((gap, i) => (
                <Text key={i} style={{ ...body, margin: '0 0 10px' }}>
                  {`${i + 1}. ${gap}`}
                </Text>
              ))}
            </>
          ) : null}

          <Hr style={{ borderColor: '#e5e7eb', margin: '28px 0' }} />

          <Heading as="h2" style={{ ...h2, margin: '0 0 10px' }}>
            Your next step
          </Heading>
          <Text style={body}>
            The 30 Day Voice Mastery Program is a structured four-week curriculum with Bramwell,
            your Voice AI Coach: structure under pressure, specificity and evidence, confidence
            signals, then high-stakes rehearsal. Every session is impromptu and scored, with weekly
            check-ins and a Day 30 retest that proves the change. One payment of $349 USD.
          </Text>
          <Button href="https://www.bramwellai.com/program?resume=mastery" style={cta}>
            Get started, $349
          </Button>

          <Text style={{ ...small, marginTop: '28px' }}>
            View your full result at any time:{' '}
            <a href={resultUrl} style={{ color: '#0b0b0f', textDecoration: 'underline' }}>
              {resultUrl}
            </a>
          </Text>

          <Text style={{ ...small, marginTop: '16px' }}>
            You are receiving this because you completed a Bramwell voice test.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: ReadinessReport,
  subject: (data: Record<string, any>) =>
    `Your Bramwell readiness score: ${data?.score ?? 0}/100`,
  displayName: 'Readiness report',
  previewData: {
    firstName: 'Alex',
    score: 62,
    communicationType: 'signal gap',
    gaps: [
      'You open with context instead of the answer',
      'Filler words spike when you are challenged',
      'You trail off instead of landing the close',
    ],
    sessionId: '00000000-0000-0000-0000-000000000000',
  },
} satisfies TemplateEntry
