import type { ComponentType } from 'react'

export interface TemplateEntry {
  component: ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  displayName?: string
  previewData?: Record<string, any>
  /** Fixed recipient — overrides caller-provided recipientEmail when set. */
  to?: string
}

/**
 * Template registry — maps template names to their React Email components.
 * Import and register new templates here after creating them in this directory.
 *
 * Example:
 *   import { template as welcomeTemplate } from './welcome'
 *   // then add to TEMPLATES: 'welcome': welcomeTemplate
 */
import { template as readinessReportTemplate } from './readiness-report'
import { template as enrolmentConfirmedTemplate } from './enrolment-confirmed'
import { template as founderApplicationConfirmationTemplate } from './founder-application-confirmation'
import { template as founderApplicationInternalTemplate } from './founder-application-internal'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'readiness-report': readinessReportTemplate,
  'enrolment-confirmed': enrolmentConfirmedTemplate,
  'founder-application-confirmation': founderApplicationConfirmationTemplate,
  'founder-application-internal': founderApplicationInternalTemplate,
}
