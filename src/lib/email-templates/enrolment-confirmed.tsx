import React from 'react'
import {
  Body,
  Button,
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
  productName?: string
  amount?: string
  portalUrl?: string
  nextStepLabel?: string
  nextStepDescription?: string
}

const main = { backgroundColor: '#ffffff', fontFamily: 'Helvetica, Arial, sans-serif' }
const container = { maxWidth: '560px', margin: '0 auto', padding: '32px 24px' }
const h1 = { fontSize: '20px', lineHeight: '1.3', color: '#0b0b0f', margin: '0 0 20px', fontWeight: 600 }
const body = { fontSize: '15px', lineHeight: '1.7', color: '#111827', margin: '0 0 16px' }
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
const small = { fontSize: '13px', color: '#6b7280', lineHeight: '1.6', margin: '20px 0 0' }

const EnrolmentConfirmed = ({
  firstName,
  productName,
  amount,
  portalUrl,
  nextStepLabel,
  nextStepDescription,
}: Props) => {
  const greeting = firstName?.trim() ? `${firstName.trim()},` : 'Hello,'
  const url = portalUrl || 'https://bramwellai.com/portal/welcome'
  const isB2B = url.includes('calendar.app.google')
  const label = nextStepLabel || (isB2B ? 'Book your kickoff call' : 'Begin onboarding')
  const description =
    nextStepDescription ||
    (isB2B
      ? 'Your implementation begins with a 30-minute kickoff call. We will confirm your team size, sales process, and the recorded calls we need to analyse.'
      : 'Your first task is the onboarding assessment. The assessment establishes your current baseline and confirms the benchmark for your programme. Complete the assessment before Day 1. Allow 20 to 30 minutes and complete it in one sitting. Your programme unlocks automatically on completion.')

  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>Your enrolment is confirmed. Your next step is inside.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Your enrolment is confirmed.</Heading>
          <Text style={body}>{greeting}</Text>
          <Text style={body}>Welcome to your Bramwell programme.</Text>
          <Text style={{ ...body, margin: '0 0 24px' }}>{description}</Text>
          <Button href={url} style={cta}>
            {label}
          </Button>
          <Text style={{ ...body, margin: '28px 0 0' }}>Bramwell</Text>
          {productName ? (
            <Text style={small}>
              Enrolment record: {productName}
              {amount ? `, ${amount}` : ''}.
            </Text>
          ) : null}
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: EnrolmentConfirmed,
  subject: (data: Record<string, any>) =>
    `Enrolment confirmed: ${data?.productName || 'Speak Like a CEO'}`,
  displayName: 'Enrolment confirmed',
  previewData: {
    firstName: 'Sarah',
    productName: 'Speak Like a CEO, 30 Day Program',
    amount: 'USD $349.00',
    portalUrl: 'https://bramwellai.com/portal/welcome',
  },
} satisfies TemplateEntry
