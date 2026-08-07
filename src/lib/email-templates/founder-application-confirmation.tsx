import React from 'react'
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props {
  firstName?: string
  bookingUrl?: string
}

const main = { backgroundColor: '#ffffff', fontFamily: 'Helvetica, Arial, sans-serif' }
const container = { maxWidth: '560px', margin: '0 auto', padding: '32px 24px' }
const h1 = { fontSize: '20px', lineHeight: '1.3', color: '#0b0b0f', margin: '0 0 20px', fontWeight: 600 }
const body = { fontSize: '15px', lineHeight: '1.7', color: '#111827', margin: '0 0 16px' }
const list = { fontSize: '15px', lineHeight: '1.7', color: '#111827', margin: '0 0 16px', paddingLeft: '20px' }
const small = { fontSize: '13px', color: '#6b7280', lineHeight: '1.6', margin: '20px 0 0' }

const FounderApplicationConfirmation = ({ firstName, bookingUrl }: Props) => {
  const greeting = firstName?.trim() ? `${firstName.trim()},` : 'Hello,'
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>We received your application. We will be in touch within two business days.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Your application is received.</Heading>
          <Text style={body}>{greeting}</Text>
          <Text style={body}>
            Thank you for applying for the Elite Sales Voice AI Coach 30 Day Program.
          </Text>
          <Text style={body}>What happens next:</Text>
          <ul style={list}>
            <li>We review every application by hand.</li>
            <li>If your business is a fit, we will email you within two business days to arrange a 30-minute qualification call.</li>
            <li>On the call we will discuss your sales team, your current pipeline, and whether the programme is the right fit.</li>
          </ul>
          {bookingUrl ? (
            <Text style={body}>
              You can also book your qualification call directly here:{' '}
              <a href={bookingUrl} style={{ color: '#0b0b0f', textDecoration: 'underline' }}>
                {bookingUrl}
              </a>
            </Text>
          ) : null}
          <Text style={body}>Reply to this email if you have any questions in the meantime.</Text>
          <Text style={{ ...body, margin: '28px 0 0' }}>Bramwell AI</Text>
          <Text style={small}>
            This email was sent because you submitted an application on bramwellai.com/founders.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: FounderApplicationConfirmation,
  subject: 'Your application is received — Bramwell AI',
  displayName: 'Founder application confirmation',
  previewData: {
    firstName: 'Sarah',
    bookingUrl: 'https://calendar.app.google/QWKYUsrzx2k44UE76',
  },
} satisfies TemplateEntry
