import type { Appointment, Operatory, Provider } from '@/types'
import { procedureTemplates } from './procedures'

export const providers: Provider[] = [
  { id: 'pr1', name: 'Dr. Sarah Chen', role: 'Dentist', color: '#0f766e' },
  { id: 'pr2', name: 'Dr. Marcus Rivera', role: 'Dentist', color: '#1d4ed8' },
  { id: 'pr3', name: 'Dr. Emily Park', role: 'Dentist', color: '#7c3aed' },
  { id: 'pr4', name: 'Dr. James Okonkwo', role: 'Dentist', color: '#b45309' },
  { id: 'pr5', name: 'Dr. Priya Sharma', role: 'Specialist', color: '#be123c' },
  { id: 'pr6', name: 'Dr. Kevin Walsh', role: 'Specialist', color: '#0e7490' },
  { id: 'pr7', name: 'Amy Torres, RDH', role: 'Hygienist', color: '#047857' },
  { id: 'pr8', name: 'Lisa Nguyen, RDH', role: 'Hygienist', color: '#4d7c0f' },
  { id: 'pr9', name: 'Carlos Mendoza, RDH', role: 'Hygienist', color: '#0369a1' },
  { id: 'pr10', name: 'Nina Patel, RDH', role: 'Hygienist', color: '#9333ea' },
  { id: 'pr11', name: 'Dr. Hannah Brooks', role: 'Dentist', color: '#c2410c' },
  { id: 'pr12', name: 'Dr. Omar Hassan', role: 'Specialist', color: '#334155' },
]

export const operatories: Operatory[] = [
  { id: 'op1', name: 'Operatory 1', roomNumber: 1 },
  { id: 'op2', name: 'Operatory 2', roomNumber: 2 },
  { id: 'op3', name: 'Operatory 3', roomNumber: 3 },
  { id: 'op4', name: 'Operatory 4', roomNumber: 4 },
  { id: 'op5', name: 'Operatory 5', roomNumber: 5 },
  { id: 'op6', name: 'Operatory 6', roomNumber: 6 },
  { id: 'op7', name: 'Hygiene 1', roomNumber: 7 },
  { id: 'op8', name: 'Hygiene 2', roomNumber: 8 },
]

/** Curated 10-appointment demo schedule for the current clinic week */
const scheduleSeed: Array<{
  patientName: string
  providerId: string
  operatoryId: string
  procedureTemplateId: string
  startTime: string
  status: Appointment['status']
  notes?: string
}> = [
  {
    patientName: 'Jordan Smith',
    providerId: 'pr7',
    operatoryId: 'op7',
    procedureTemplateId: 'pt1',
    startTime: '2026-07-13T08:00:00',
    status: 'confirmed',
  },
  {
    patientName: 'Maria Garcia',
    providerId: 'pr1',
    operatoryId: 'op1',
    procedureTemplateId: 'pt7',
    startTime: '2026-07-13T09:30:00',
    status: 'confirmed',
  },
  {
    patientName: 'Liam Johnson',
    providerId: 'pr2',
    operatoryId: 'op2',
    procedureTemplateId: 'pt10',
    startTime: '2026-07-14T08:00:00',
    status: 'scheduled',
  },
  {
    patientName: 'Sofia Martinez',
    providerId: 'pr8',
    operatoryId: 'op8',
    procedureTemplateId: 'pt16',
    startTime: '2026-07-14T10:00:00',
    status: 'confirmed',
  },
  {
    patientName: 'Noah Williams',
    providerId: 'pr3',
    operatoryId: 'op3',
    procedureTemplateId: 'pt8',
    startTime: '2026-07-15T08:00:00',
    status: 'checked_in',
  },
  {
    patientName: 'Emma Brown',
    providerId: 'pr5',
    operatoryId: 'op6',
    procedureTemplateId: 'pt15',
    startTime: '2026-07-15T11:00:00',
    status: 'confirmed',
    notes: 'Confirm insurance benefits before visit.',
  },
  {
    patientName: 'Ethan Davis',
    providerId: 'pr1',
    operatoryId: 'op1',
    procedureTemplateId: 'pt17',
    startTime: '2026-07-16T09:30:00',
    status: 'confirmed',
  },
  {
    patientName: 'Olivia Rodriguez',
    providerId: 'pr9',
    operatoryId: 'op7',
    procedureTemplateId: 'pt1',
    startTime: '2026-07-16T13:00:00',
    status: 'scheduled',
  },
  {
    patientName: 'Lucas Anderson',
    providerId: 'pr4',
    operatoryId: 'op4',
    procedureTemplateId: 'pt3',
    startTime: '2026-07-17T08:00:00',
    status: 'confirmed',
  },
  {
    patientName: 'Mia Thompson',
    providerId: 'pr6',
    operatoryId: 'op5',
    procedureTemplateId: 'pt18',
    startTime: '2026-07-17T14:30:00',
    status: 'scheduled',
  },
]

function buildAppointments(): Appointment[] {
  return scheduleSeed.map((seed, index) => {
    const template = procedureTemplates.find((t) => t.id === seed.procedureTemplateId)!
    return {
      id: `ap${index + 1}`,
      patientName: seed.patientName,
      providerId: seed.providerId,
      operatoryId: seed.operatoryId,
      procedureTemplateId: seed.procedureTemplateId,
      startTime: seed.startTime,
      durationMinutes: template.averageDurationMinutes || 30,
      status: seed.status,
      notes: seed.notes,
    }
  })
}

export const appointments: Appointment[] = buildAppointments()

export function getProvider(id: string) {
  return providers.find((p) => p.id === id)
}

export function getOperatory(id: string) {
  return operatories.find((o) => o.id === id)
}
