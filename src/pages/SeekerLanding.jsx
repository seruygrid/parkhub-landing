import { useState } from 'react'
import { submitRenterLead } from '../lib/leadApi'

const PAIN_POINTS = [
  {
    title: 'Немає місця під будинком',
    description: 'Вільних паркомісць у дворі новобудови не знайти — всі зайняті.',
  },
  {
    title: 'Годинами шукаєте паркування',
    description: 'Щодня витрачаєте час на пошук місця на вулиці.',
  },
  {
    title: 'Ненадійні оголошення',
    description: 'Власники не відповідають або місця вже зайняті.',
  },
]

const STEPS = [
  { num: 1, title: 'Заповніть форму', description: 'Вкажіть район, бюджет та контакти.' },
  { num: 2, title: 'Отримайте підбір', description: 'Ми знайдемо підходящі паркомісця у Львові.' },
  { num: 3, title: 'Ознайомтесь з варіантами', description: 'Перегляньте пропозиції та оберіть найкраще.' },
  { num: 4, title: 'Оформте абонемент', description: 'Підписуєте договір і отримуєте доступ.' },
]

export default function SeekerLanding() {
  const [form, setForm] = useState({
    name: '',
    district: '',
    when: '',
    budget: '',
    phone: '',
    messenger: 'telegram',
    honeypot: '',
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState('idle')
  const [statusMessage, setStatusMessage] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const validate = () => {
    const nextErrors = {}

    if (!form.district.trim()) {
      nextErrors.district = 'Вкажіть район або адресу.'
    }

    if (!form.budget || Number(form.budget) <= 0) {
      nextErrors.budget = 'Вкажіть бюджет на місяць.'
    }

    if (!form.phone.trim()) {
      nextErrors.phone = 'Вкажіть номер телефону.'
    }

    return nextErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Honeypot: if filled, silently abort
    if (form.honeypot && form.honeypot.trim() !== '') {
      return
    }

    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setErrors({})
    setIsSubmitting(true)
    setStatus('idle')
    setStatusMessage('')

    try {
      await submitRenterLead(form)
      setStatus('success')
      setStatusMessage("Дякуємо! Ми зв'яжемося з вами найближчим часом.")
      setForm((prev) => ({
        ...prev,
        // keep messenger selection, reset the rest
        name: '',
        district: '',
        when: '',
        budget: '',
        phone: '',
        honeypot: '',
      }))
    } catch (error) {
      console.error('Failed to submit renter lead', error)
      setStatus('error')
      setStatusMessage(
        'Сталася помилка. Спробуйте ще раз або напишіть нам у месенджер.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 right-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-60" />
          <div className="absolute bottom-20 left-0 w-80 h-80 bg-indigo-50 rounded-full blur-3xl opacity-50" />
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
              Знайдіть паркомісце у Львові за 24 години
            </h1>
            <p className="mt-6 text-xl text-gray-600">
              Ми підбираємо для вас приватні паркомісця в новобудовах на Сихові.
            </p>
            <a
              href="#form"
              className="mt-8 inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-colors"
            >
              Знайти паркомісце
            </a>
          </div>
        </div>
      </section>

      {/* Problem section */}
      <section className="py-20 bg-gray-50/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center">
            Знайома ситуація?
          </h2>
          <div className="mt-12 grid sm:grid-cols-3 gap-8">
            {PAIN_POINTS.map((item) => (
              <div
                key={item.title}
                className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center">
            Як це працює
          </h2>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((step) => (
              <div key={step.num} className="flex items-start gap-4">
                <span className="flex-shrink-0 w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 font-semibold flex items-center justify-center">
                  {step.num}
                </span>
                <div>
                  <h3 className="font-semibold text-gray-900">{step.title}</h3>
                  <p className="mt-1 text-gray-600 text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lead form */}
      <section id="form" className="py-20 bg-gray-50/50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center">
            Отримайте підбір паркомісць
          </h2>
          <p className="mt-3 text-gray-600 text-center">
            Заповніть форму — ми зв'яжемося протягом 24 годин.
          </p>
          <form
            onSubmit={handleSubmit}
            className="mt-10 p-8 bg-white rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="space-y-5">
              <div className="hidden">
                <label htmlFor="company">Компанія</label>
                <input
                  id="company"
                  type="text"
                  name="honeypot"
                  value={form.honeypot}
                  onChange={handleChange}
                  autoComplete="off"
                  tabIndex={-1}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Ім'я (необов'язково)
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Ваше ім'я"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Район або адреса
                </label>
                <input
                  type="text"
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                  placeholder="наприклад, Сихів, вул. Наукова"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  required
                />
                {errors.district && (
                  <p className="mt-1 text-sm text-red-600">{errors.district}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Коли потрібно (необов'язково)
                </label>
                <input
                  type="text"
                  name="when"
                  value={form.when}
                  onChange={handleChange}
                  placeholder="наприклад, з 1 березня"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Бюджет на місяць (грн)
                </label>
                <input
                  type="number"
                  name="budget"
                  value={form.budget}
                  onChange={handleChange}
                  placeholder="2000"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  required
                />
                {errors.budget && (
                  <p className="mt-1 text-sm text-red-600">{errors.budget}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Телефон
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+380 XX XXX XX XX"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  required
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Viber / Telegram
                </label>
                <select
                  name="messenger"
                  value={form.messenger}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                >
                  <option value="telegram">Telegram</option>
                  <option value="viber">Viber</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-8 w-full py-4 text-base font-semibold text-white bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Надсилаємо…' : 'Надіслати заявку'}
            </button>
            {status === 'success' && statusMessage && (
              <p className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                {statusMessage}
              </p>
            )}
            {status === 'error' && statusMessage && (
              <p className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                {statusMessage}
              </p>
            )}
          </form>
        </div>
      </section>

      {/* Trust section */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="p-8 bg-indigo-50/50 rounded-2xl border border-indigo-100">
            <p className="text-lg text-gray-700">
              Зараз ми формуємо найбільшу базу приватних паркомісць у Львові.
              Приєднуйтесь до тих, хто вже не шукає паркування на вулиці.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Готові знайти своє паркомісце?
          </h2>
          <p className="mt-4 text-gray-300">
            Заповніть форму вище — ми підберемо варіанти протягом 24 годин.
          </p>
          <a
            href="#form"
            className="mt-8 inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-indigo-600 bg-white rounded-xl hover:bg-gray-100 transition-colors"
          >
            Знайти паркомісце
          </a>
        </div>
      </section>
    </div>
  )
}
