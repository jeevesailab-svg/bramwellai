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
  lastName?: string
  email?: string
  company?: string
  teamSize?: string
  role?: string
  source?: string
}

const main = { backgroundColor: '#ffffff', fontFamily: 'Helvetica, Arial, sans-serif' }
const container = { maxWidth: '560px', margin: '0 auto', padding: '32px 24px' }
const h1 = { fontSize: '20px', lineHeight: '1.3', color: '#0b0b0f', margin: '0 0 20px', fontWeight: 600 }
const body = { fontSize: '15px', lineHeight: '1.7', color: '#111827', margin: '0 0 12px' }
const label = { fontSize: '13px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' as const, letterSpacing: '0.05em', margin: '16px 0 4px' }

const FounderApplicationInternal = ({
  firstName,
  lastName,
  email,
  company,
  teamSize,
  role,
  source,
}: Props) => {
  const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'Unknown'
  const companyName = company || 'Unknown'
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>New founder application from {fullName} at {companyName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New founder application</Heading>
          <Text style={body}>A new application has been submitted on bramwellai.com/founders.</Text>

          <Text style={label}>Name</Text>
          <Text style={body}>{fullName}</Text>

          <Text style={label}>Email</Text>
          <Text style={body}>{email || 'Not provided'}</Text>

          <Text style={label}>Company</Text>
          <Text style={body}>{companyName}</Text>

          <Text style={label}>Team size</Text>
          <Text style={body}>{teamSize || 'Not provided'}</Text>

          <Text style={label}>Role</Text>
          <Text style={body}>{role || 'Not provided'}</Text>

          {source ? (
            <>
              <Text style={label}>Source</Text>
              <Text style={body}>{source}</Text>
            </>
          ) : null}
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: FounderApplicationInternal,
  subject: (data: Record<string, any>) =>
    `New founder application: ${[data?.firstName, data?.lastName].filter(Boolean).join(' ') || 'Unknown'} at ${data?.company || 'Unknown'}`,
  displayName: 'Founder application internal',
  to: 'bramwell@bramwellai.com',
  previewData: {
    firstName: 'Sarah',
    lastName: 'Chen',
    email: 'sarah@example.com',
    company: 'ExampleCo',
    teamSize: '6-15 salespeople',
    role: 'Founder / CEO',
    source: 'founders_page',
  },
} satisfies TemplateEntry
