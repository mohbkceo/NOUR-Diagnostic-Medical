import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { CheckCircle2, MessageCircle } from 'lucide-react'
import { Field, Input, Select, Textarea, Button, Spinner } from '../ui'
import { DocumentUpload } from './DocumentUpload'
import { Turnstile } from './Turnstile'
import { useSupabaseData } from '../../hooks/useSupabaseData'
import { useSiteSettings } from '../../hooks/useSiteSettings'
import { contentQueries } from '../../services/content'
import { placeholderServices } from '../../data/placeholders'
import { uploadReservationDocument, submitReservation } from '../../services/reservations'
import { validateReservation, hasErrors, LIMITS } from '../../utils/validation'
import { getSubmitCooldownRemaining, markSubmitted } from '../../utils/rateLimit'
import { fr } from '../../content/fr'

const initialValues = {
  fullName: '',
  phone: '',
  serviceId: '',
  preferredDate: '',
  preferredTime: '',
  message: '',
}

export function ReservationForm() {
  const location = useLocation()
  const { settings } = useSiteSettings()
  const { data: services } = useSupabaseData(contentQueries.services, [], placeholderServices)

  const [values, setValues] = useState({
    ...initialValues,
    serviceId: location.state?.serviceId ?? '',
  })
  const [file, setFile] = useState(null)
  const [fileError, setFileError] = useState(null)
  const [turnstileToken, setTurnstileToken] = useState(null)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [errorMessage, setErrorMessage] = useState(null)

  function setField(name, value) {
    setValues((v) => ({ ...v, [name]: value }))
  }

  const whatsappHref = settings.whatsapp
    ? `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
        `Bonjour, je souhaite confirmer ma demande de rendez-vous (${values.fullName}).`
      )}`
    : null

  async function handleSubmit(e) {
    e.preventDefault()
    setErrorMessage(null)

    const cooldown = getSubmitCooldownRemaining()
    if (cooldown > 0) {
      setErrorMessage('Veuillez patienter avant de soumettre une nouvelle demande.')
      return
    }

    const validationErrors = validateReservation(values)
    if (fileError) validationErrors.document = fileError
    if (import.meta.env.VITE_TURNSTILE_SITE_KEY && !turnstileToken) {
      validationErrors.turnstile = 'Veuillez compléter la vérification de sécurité.'
    }

    setErrors(validationErrors)
    if (hasErrors(validationErrors)) return

    setStatus('submitting')
    try {
      let documentPath = null
      if (file) {
        documentPath = await uploadReservationDocument(file)
      }

      await submitReservation({
        fullName: values.fullName.trim(),
        phone: values.phone.trim(),
        serviceId: values.serviceId,
        preferredDate: values.preferredDate,
        preferredTime: values.preferredTime,
        message: values.message.trim() || null,
        documentPath,
        turnstileToken,
      })

      markSubmitted()
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMessage(err?.message || "Une erreur est survenue. Veuillez réessayer.")
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-lg border border-line bg-white p-8 text-center">
        <CheckCircle2 className="mx-auto text-emerald-600" size={32} />
        <h2 className="mt-4 text-xl font-semibold text-ink">{fr.reservation.success.title}</h2>
        <p className="mt-2 text-ink-soft">{fr.reservation.success.text}</p>
        {whatsappHref ? (
          <Button as="a" href={whatsappHref} target="_blank" rel="noreferrer" variant="outline" className="mt-6">
            <MessageCircle size={16} />
            {fr.reservation.success.whatsapp}
          </Button>
        ) : null}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <p className="rounded-md bg-primary-50 px-4 py-3 text-sm text-primary-700">{fr.reservation.intro}</p>

      <Field label={fr.reservation.fields.fullName} htmlFor="fullName" required error={errors.fullName}>
        <Input
          id="fullName"
          value={values.fullName}
          maxLength={LIMITS.fullName.max}
          onChange={(e) => setField('fullName', e.target.value)}
          invalid={Boolean(errors.fullName)}
          autoComplete="name"
        />
      </Field>

      <Field label={fr.reservation.fields.phone} htmlFor="phone" required error={errors.phone}>
        <Input
          id="phone"
          type="tel"
          value={values.phone}
          maxLength={LIMITS.phone.max}
          onChange={(e) => setField('phone', e.target.value)}
          invalid={Boolean(errors.phone)}
          autoComplete="tel"
        />
      </Field>

      <Field label={fr.reservation.fields.service} htmlFor="serviceId" required error={errors.serviceId}>
        <Select
          id="serviceId"
          value={values.serviceId}
          onChange={(e) => setField('serviceId', e.target.value)}
          invalid={Boolean(errors.serviceId)}
        >
          <option value="">Sélectionner…</option>
          {(services ?? []).map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </Select>
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={fr.reservation.fields.preferredDate} htmlFor="preferredDate" required error={errors.preferredDate}>
          <Input
            id="preferredDate"
            type="date"
            min={new Date().toISOString().slice(0, 10)}
            value={values.preferredDate}
            onChange={(e) => setField('preferredDate', e.target.value)}
            invalid={Boolean(errors.preferredDate)}
          />
        </Field>
        <Field label={fr.reservation.fields.preferredTime} htmlFor="preferredTime" required error={errors.preferredTime}>
          <Input
            id="preferredTime"
            type="time"
            value={values.preferredTime}
            onChange={(e) => setField('preferredTime', e.target.value)}
            invalid={Boolean(errors.preferredTime)}
          />
        </Field>
      </div>

      <Field label={fr.reservation.fields.document}>
        <DocumentUpload file={file} onChange={setFile} error={fileError} setError={setFileError} />
      </Field>

      <Field label={fr.reservation.fields.message} htmlFor="message" error={errors.message}>
        <Textarea
          id="message"
          value={values.message}
          maxLength={LIMITS.message.max}
          onChange={(e) => setField('message', e.target.value)}
          invalid={Boolean(errors.message)}
        />
      </Field>

      <Turnstile onVerify={setTurnstileToken} onExpire={() => setTurnstileToken(null)} />
      {errors.turnstile ? <p className="text-sm text-red-600">{errors.turnstile}</p> : null}

      {errorMessage ? (
        <p role="alert" className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-600">
          {errorMessage}
        </p>
      ) : null}

      <Button type="submit" size="lg" className="w-full" disabled={status === 'submitting'}>
        {status === 'submitting' ? <Spinner size={16} /> : null}
        {status === 'submitting' ? fr.reservation.submitting : fr.reservation.submit}
      </Button>
    </form>
  )
}
