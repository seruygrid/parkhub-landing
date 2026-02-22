import { useState } from 'react'
import { submitOwnerLead } from '../lib/leadApi'

const BENEFITS = [
  {
    title: 'Не шукайте орендарів',
    description: 'Ми знаходимо клієнтів на місячний абонемент — вам не потрібно розміщувати оголошення.',
  },
  {
    title: 'Ви встановлюєте ціну',
    description: 'Орендна плата залежить від вас. Ми лише з\'єднуємо з тими, хто готовий платити.',
  },
  {
    title: 'Стабільний дохід щомісяця',
    description: 'Орендарі платять регулярно. Менше турбот, більше передбачуваності.',
  },
]

const STEPS = [
  { num: 1, title: 'Додайте паркомісце', description: 'Заповніть форму з районом, ціною та умовами.' },
  { num: 2, title: 'Ми перевіряємо', description: 'Швидко підтверджуємо дані та додаємо до бази.' },
  { num: 3, title: 'Отримуйте заявки', description: 'Підбираємо орендарів і організовуємо зустріч.' },
]

export default function OwnerLanding() {
  const [form, setForm] = useState({
    name: '',
    district: '',
    type: 'underground',
    availability: '',
    price: '',
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
      nextErrors.district = 'Вкажіть район або ЖК.'
    }

    if (!form.price || Number(form.price) <= 0) {
      nextErrors.price = 'Вкажіть ціну за місяць.'
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
      await submitOwnerLead(form)
      setStatus('success')
      setStatusMessage("Дякуємо! Ми зв'яжемося з вами найближчим часом.")
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({
        event: 'lead_owner_submit',
        page_type: 'owner',
      })
      setForm((prev) => ({
        ...prev,
        name: '',
        district: '',
        availability: '',
        price: '',
        phone: '',
        honeypot: '',
      }))
    } catch (error) {
      console.error('Failed to submit owner lead', error)
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
          <div className="absolute top-20 left-0 w-80 h-80 bg-emerald-50 rounded-full blur-3xl opacity-60" />
          <div className="absolute bottom-20 right-0 w-96 h-96 bg-teal-50 rounded-full blur-3xl opacity-50" />
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
              Здавайте паркомісце в новобудові без зайвих дзвінків
            </h1>
            <p className="mt-6 text-xl text-gray-600">
              Знаходимо орендарів на місячний абонемент у Львові.
            </p>
            <a
              href="#form"
              className="mt-8 inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-emerald-600 rounded-xl shadow-lg shadow-emerald-500/30 hover:bg-emerald-700 transition-colors"
            >
              Додати паркомісце
            </a>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-gray-50/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center">
            Чому здавати через нас
          </h2>
          <div className="mt-12 grid sm:grid-cols-3 gap-8">
            {BENEFITS.map((item) => (
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
          <div className="mt-12 grid sm:grid-cols-3 gap-8">
            {STEPS.map((step) => (
              <div key={step.num} className="flex items-start gap-4">
                <span className="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 font-semibold flex items-center justify-center">
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

      {/* Owner form */}
      <section id="form" className="py-20 bg-gray-50/50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center">
            Додайте своє паркомісце
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
                <label htmlFor="website">Сайт</label>
                <input
                  id="website"
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
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Район / ЖК
                </label>
                <input
                  type="text"
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                  placeholder="наприклад, Сихів, ЖК Наукова"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                  required
                />
                {errors.district && (
                  <p className="mt-1 text-sm text-red-600">{errors.district}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Тип паркінгу
                </label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                >
                  <option value="underground">Підземний паркінг</option>
                  <option value="ground">Наземний паркінг</option>
                  <option value="open">Відкритий майданчик</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Доступність (24/7 або графік)
                </label>
                <input
                  type="text"
                  name="availability"
                  value={form.availability}
                  onChange={handleChange}
                  placeholder="наприклад, 24/7 або будні 8:00–20:00"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Ціна за місяць (грн)
                </label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="2500"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                  required
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price}</p>
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
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                  required
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Месенджер
                </label>
                <select
                  name="messenger"
                  value={form.messenger}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                >
                  <option value="telegram">Telegram</option>
                  <option value="viber">Viber</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-8 w-full py-4 text-base font-semibold text-white bg-emerald-600 rounded-xl shadow-lg shadow-emerald-500/30 hover:bg-emerald-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
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

      {/* Scarcity / Early access */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="p-8 bg-amber-50 rounded-2xl border border-amber-200">
            <p className="text-lg font-medium text-amber-900">
              Ми зараз приймаємо перших власників паркомісць у Львові.
            </p>
            <p className="mt-2 text-amber-800">
              Ранні учасники отримують пріоритетний підбір орендарів.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Готові здати паркомісце?
          </h2>
          <p className="mt-4 text-gray-300">
            Заповніть форму вище — ми зв'яжемося протягом 24 годин.
          </p>
          <a
            href="#form"
            className="mt-8 inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-emerald-600 bg-white rounded-xl hover:bg-gray-100 transition-colors"
          >
            Додати паркомісце
          </a>
        </div>
      </section>
    </div>
  )
}
