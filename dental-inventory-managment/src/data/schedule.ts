import type { Appointment, AppointmentStatus, Operatory, Provider } from '@/types'
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

const firstNames = [
  'Jordan', 'Alex', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Quinn', 'Avery', 'Jamie', 'Cameron',
  'Drew', 'Harper', 'Reese', 'Skyler', 'Parker', 'Rowan', 'Finley', 'Sawyer', 'Emerson', 'Hayden',
  'Maria', 'Luis', 'Sofia', 'Noah', 'Emma', 'Liam', 'Olivia', 'Ethan', 'Mia', 'Lucas',
  'Amelia', 'Henry', 'Charlotte', 'Jack', 'Evelyn', 'Daniel', 'Grace', 'Michael', 'Chloe', 'David',
]

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
]

/** Week of Jul 13, 2026 (Mon) through Jul 24, 2026 (Fri next week) — clinic days Mon–Fri */
const clinicDays = [
  '2026-07-13',
  '2026-07-14',
  '2026-07-15',
  '2026-07-16',
  '2026-07-17',
  '2026-07-20',
  '2026-07-21',
  '2026-07-22',
  '2026-07-23',
  '2026-07-24',
]

const statuses: AppointmentStatus[] = ['scheduled', 'confirmed', 'confirmed', 'confirmed', 'checked_in']

/** Procedure mix weighted toward common general practice work */
const dentistProcedureIds = [
  'pt3', 'pt4', 'pt5', 'pt6', 'pt7', 'pt7', 'pt8', 'pt8', 'pt9',
  'pt10', 'pt11', 'pt14', 'pt15', 'pt17', 'pt18', 'pt29', 'pt31', 'pt34', 'pt48', 'pt49', 'pt50',
  'pt12', 'pt13', 'pt20', 'pt21', 'pt23', 'pt44', 'pt45',
]

const hygienistProcedureIds = [
  'pt1', 'pt1', 'pt1', 'pt2', 'pt16', 'pt24', 'pt25', 'pt26', 'pt46', 'pt35',
]

const specialistProcedureIds = [
  'pt15', 'pt14', 'pt19', 'pt20', 'pt39', 'pt40', 'pt18', 'pt38', 'pt36',
]

function pick<T>(arr: T[], n: number): T {
  return arr[n % arr.length]
}

function buildAppointments(): Appointment[] {
  const appointments: Appointment[] = []
  let seq = 1

  // Assign providers to operatories loosely
  const dentistProviders = providers.filter((p) => p.role === 'Dentist')
  const hygienists = providers.filter((p) => p.role === 'Hygienist')
  const specialists = providers.filter((p) => p.role === 'Specialist')

  for (const day of clinicDays) {
    // 8 operatories × ~3 appointments average ≈ 24/day × 10 days = 240, plus extras to 250
    for (let opIndex = 0; opIndex < operatories.length; opIndex++) {
      const op = operatories[opIndex]
      const isHygiene = opIndex >= 6

      let provider: Provider
      let procedurePool: string[]
      if (isHygiene) {
        provider = pick(hygienists, opIndex + seq)
        procedurePool = hygienistProcedureIds
      } else if (opIndex === 5) {
        provider = pick(specialists, seq)
        procedurePool = specialistProcedureIds
      } else {
        provider = pick(dentistProviders, opIndex + day.length)
        procedurePool = dentistProcedureIds
      }

      // Stagger start times: 8:00, 9:00/9:30, 10:30, 13:00, 14:30 depending on duration
      const slots = isHygiene
        ? ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00']
        : ['08:00', '09:30', '11:00', '13:00', '14:30', '16:00']

      const slotsToday = isHygiene ? slots.slice(0, 4) : slots.slice(0, 3)

      for (let s = 0; s < slotsToday.length; s++) {
        if (appointments.length >= 250) break
        const templateId = pick(procedurePool, seq * 7 + s * 3 + opIndex)
        const template = procedureTemplates.find((t) => t.id === templateId)!
        const patientName = `${pick(firstNames, seq + s)} ${pick(lastNames, seq * 3 + opIndex)}`
        const startTime = `${day}T${slotsToday[s]}:00`
        appointments.push({
          id: `ap${seq}`,
          patientName,
          providerId: provider.id,
          operatoryId: op.id,
          procedureTemplateId: templateId,
          startTime,
          durationMinutes: template.averageDurationMinutes || 30,
          status: pick(statuses, seq),
          notes: seq % 11 === 0 ? 'Confirm insurance benefits before visit.' : undefined,
        })
        seq += 1
      }
    }
  }

  // Top up to exactly 250 with overflow afternoon slots
  let dayIdx = 0
  while (appointments.length < 250) {
    const day = clinicDays[dayIdx % clinicDays.length]
    const op = operatories[appointments.length % operatories.length]
    const provider = dentistProviders[appointments.length % dentistProviders.length]
    const templateId = pick(dentistProcedureIds, appointments.length)
    const template = procedureTemplates.find((t) => t.id === templateId)!
    appointments.push({
      id: `ap${seq}`,
      patientName: `${pick(firstNames, seq)} ${pick(lastNames, seq + 5)}`,
      providerId: provider.id,
      operatoryId: op.id,
      procedureTemplateId: templateId,
      startTime: `${day}T16:30:00`,
      durationMinutes: template.averageDurationMinutes || 30,
      status: 'scheduled',
    })
    seq += 1
    dayIdx += 1
  }

  return appointments
}

export const appointments: Appointment[] = buildAppointments()

export function getProvider(id: string) {
  return providers.find((p) => p.id === id)
}

export function getOperatory(id: string) {
  return operatories.find((o) => o.id === id)
}
