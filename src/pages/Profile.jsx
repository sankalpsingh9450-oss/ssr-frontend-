import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'
import {
  FiBell,
  FiCheckCircle,
  FiClock,
  FiDownload,
  FiEdit3,
  FiFileText,
  FiFolder,
  FiHeart,
  FiHelpCircle,
  FiImage,
  FiLogOut,
  FiMail,
  FiMapPin,
  FiMoreHorizontal,
  FiPhone,
  FiRefreshCw,
  FiSettings,
  FiShield,
  FiTrash2,
  FiUploadCloud,
  FiUser,
  FiXCircle,
} from 'react-icons/fi'
import { SITE } from '../constants'
import { dashboardApi, dashboardKeys } from '../lib/dashboardApi'
import { normalizeProfileInput, passwordChangeSchema, profileSchema } from '../lib/dashboardSchemas'
import { clearSession } from '../lib/session'
import ResponsiveImage from '../components/ResponsiveImage'

const navItems = [
  { key: 'overview', label: 'Profile', path: '/profile', icon: FiUser },
  { key: 'saved-projects', label: 'Saved Projects', path: '/profile/saved-projects', icon: FiHeart },
  { key: 'inquiries', label: 'My Inquiries', path: '/profile/inquiries', icon: FiFolder },
  { key: 'quote-requests', label: 'Quote Requests', path: '/profile/quote-requests', icon: FiFileText },
  { key: 'settings', label: 'Settings', path: '/profile/settings', icon: FiSettings },
  { key: 'help-support', label: 'Help & Support', path: '/profile/help-support', icon: FiHelpCircle },
]

const sectionTitles = {
  overview: {
    title: 'Profile overview',
    description: 'Manage your personal details, profile image, and account access in one place.',
  },
  'saved-projects': {
    title: 'Saved projects',
    description: 'Review your shortlisted opportunities, compare them, and jump back into the inquiry flow quickly.',
  },
  inquiries: {
    title: 'Inquiry history',
    description: 'Track every lead you have submitted and monitor follow-up status across services.',
  },
  'quote-requests': {
    title: 'Quote requests',
    description: 'Review quotes, download documents, and respond to proposals directly from your dashboard.',
  },
  settings: {
    title: 'Settings',
    description: 'Control notifications, privacy, linked accounts, password security, and data preferences.',
  },
  'help-support': {
    title: 'Help & Support',
    description: 'Find quick guidance, contact the support team, and recover from blockers without leaving your dashboard.',
  },
}

const inputClassName =
  'mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/30'

function getSectionFromPath(pathname) {
  if (pathname.startsWith('/profile/saved-projects')) return 'saved-projects'
  if (pathname.startsWith('/profile/inquiries')) return 'inquiries'
  if (pathname.startsWith('/profile/quote-requests')) return 'quote-requests'
  if (pathname.startsWith('/profile/settings')) return 'settings'
  if (pathname.startsWith('/profile/help-support')) return 'help-support'
  return 'overview'
}

function LoadingBlock({ label = 'Loading dashboard data...' }) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
      <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-white/60">
        <FiRefreshCw className="animate-spin" />
        {label}
      </div>
      <div className="mt-5 space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-20 animate-pulse rounded-2xl bg-slate-100 dark:bg-white/5" />
        ))}
      </div>
    </div>
  )
}

function EmptyState({ title, text, action }) {
  return (
    <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center dark:border-white/15 dark:bg-white/[0.03]">
      <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#d4af37]/15 text-2xl text-[#d4af37]">
        <FiFolder />
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-white/60">{text}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}

function StatusPill({ status }) {
  const map = {
    Pending: 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-200',
    Contacted: 'bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-200',
    Completed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-200',
    Sent: 'bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-200',
    Reviewed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-200',
    Declined: 'bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-200',
  }

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${map[status] || 'bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-white/70'}`}>
      {status}
    </span>
  )
}

function ProfileOverviewSection({ profile, onSave, onUploadAvatar, onLogout, isSaving, isUploading }) {
  const [editing, setEditing] = useState(false)
  const fileInputRef = useRef(null)
  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    mode: 'onChange',
    defaultValues: profile,
  })

  useEffect(() => {
    profileForm.reset(profile)
  }, [profile, profileForm])

  const submitProfile = async (values) => {
    const normalized = normalizeProfileInput(values)
    await onSave(normalized)
    setEditing(false)
  }

  const handleAvatarSelection = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      onUploadAvatar(reader.result)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[340px,minmax(0,1fr)]">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
        <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-full border-4 border-[#d4af37]/30 bg-slate-100 dark:bg-white/5">
          {profile.avatar ? (
            <ResponsiveImage
              src={profile.avatar}
              alt={profile.displayName}
              aspectRatio="1 / 1"
              sizes="128px"
              priority
              className="h-full"
              imgClassName="h-full w-full"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-4xl font-black text-[#1a2540] dark:text-[#d4af37]">
              {profile.displayName?.charAt(0)}
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarSelection}
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-[#d4af37] hover:text-slate-900 dark:border-white/10 dark:text-white/80 dark:hover:text-white"
        >
          {isUploading ? <FiRefreshCw className="animate-spin" /> : <FiUploadCloud />}
          {isUploading ? 'Uploading avatar...' : 'Upload avatar'}
        </button>

        <div className="mt-6 space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 dark:text-white/40">Display name</p>
            <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">{profile.displayName}</p>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-white/60"><FiMail /> {profile.email}</div>
          <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-white/60"><FiPhone /> {profile.phone}</div>
          <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-white/60"><FiClock /> User since {new Date(profile.userSince).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
        </div>

        <div className="mt-6 grid gap-3">
          <button
            type="button"
            onClick={() => setEditing((current) => !current)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#d4af37] px-4 py-3 text-sm font-bold text-[#1a2540] transition hover:bg-[#e2c04f]"
          >
            <FiEdit3 />
            {editing ? 'Cancel editing' : 'Edit profile'}
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-200 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 dark:border-rose-500/20 dark:text-rose-200 dark:hover:bg-rose-500/10"
          >
            <FiLogOut />
            Logout
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-white/40">Saved projects</p>
            <p className="mt-3 text-3xl font-black text-slate-900 dark:text-white">03</p>
            <p className="mt-2 text-sm text-slate-500 dark:text-white/60">Shortlisted projects ready for review and comparison.</p>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-white/40">Open inquiries</p>
            <p className="mt-3 text-3xl font-black text-slate-900 dark:text-white">04</p>
            <p className="mt-2 text-sm text-slate-500 dark:text-white/60">Pending and contacted inquiries that still need follow-up.</p>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-white/40">Quotes received</p>
            <p className="mt-3 text-3xl font-black text-slate-900 dark:text-white">03</p>
            <p className="mt-2 text-sm text-slate-500 dark:text-white/60">Review pricing, revision requests, and next decisions in one place.</p>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Profile details</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-white/60">Update your primary contact information and keep lead callbacks accurate.</p>
            </div>
            <span className="hidden rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200 md:inline-flex">
              Data persistence ready
            </span>
          </div>

          {editing ? (
            <form className="mt-6 grid gap-5 md:grid-cols-2" onSubmit={profileForm.handleSubmit(submitProfile)} noValidate>
              <div>
                <label htmlFor="displayName" className="text-sm font-medium text-slate-700 dark:text-white/80">Display name</label>
                <input id="displayName" className={inputClassName} {...profileForm.register('displayName')} />
                {profileForm.formState.errors.displayName ? <p className="mt-2 text-sm text-red-500">{profileForm.formState.errors.displayName.message}</p> : null}
              </div>
              <div>
                <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-white/80">Email address</label>
                <input id="email" type="email" className={inputClassName} {...profileForm.register('email')} />
                {profileForm.formState.errors.email ? <p className="mt-2 text-sm text-red-500">{profileForm.formState.errors.email.message}</p> : null}
              </div>
              <div className="md:col-span-2">
                <label htmlFor="phone" className="text-sm font-medium text-slate-700 dark:text-white/80">Phone number</label>
                <input id="phone" className={inputClassName} {...profileForm.register('phone')} />
                {profileForm.formState.errors.phone ? <p className="mt-2 text-sm text-red-500">{profileForm.formState.errors.phone.message}</p> : null}
              </div>
              <div className="md:col-span-2 flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={!profileForm.formState.isValid || isSaving}
                  className="inline-flex items-center justify-center rounded-2xl bg-[#d4af37] px-5 py-3 text-sm font-bold text-[#1a2540] transition hover:bg-[#e2c04f] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? 'Saving changes...' : 'Save profile'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    profileForm.reset(profile)
                    setEditing(false)
                  }}
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 dark:border-white/10 dark:text-white/75"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                ['Primary email', profile.email],
                ['Contact number', profile.phone],
                ['Joined', new Date(profile.userSince).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })],
                ['Lead callbacks', 'Enabled via dashboard notifications'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.03]">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-white/40">{label}</p>
                  <p className="mt-2 text-base font-semibold text-slate-900 dark:text-white">{value}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function SavedProjectsSection({ projects, compareIds, onToggleCompare, onRemove }) {
  if (!projects.length) {
    return (
      <EmptyState
        title="No saved projects yet"
        text="Save projects you want to revisit later. We’ll keep them here so you can compare options and send focused inquiries."
        action={<Link to="/" className="inline-flex rounded-2xl bg-[#d4af37] px-5 py-3 text-sm font-bold text-[#1a2540]">Explore featured projects</Link>}
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500 dark:text-white/60">Select up to 2 projects to compare quickly.</p>
        <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 dark:border-white/10 dark:text-white/70">
          {compareIds.length} selected for comparison
        </span>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {projects.map((project) => {
          const selected = compareIds.includes(project.id)
          return (
            <article key={project.id} className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
              <ResponsiveImage
                src={project.image}
                alt={project.name}
                aspectRatio="16 / 10"
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 520px"
                className="h-56"
                imgClassName="h-full w-full"
              />
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{project.name}</h3>
                    <p className="mt-2 flex items-center gap-2 text-sm text-slate-500 dark:text-white/60"><FiMapPin /> {project.location}</p>
                  </div>
                  <StatusPill status={project.type} />
                </div>

                <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-600 dark:text-white/70">
                  <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-white/5">{project.budget}</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-white/5">Quick compare ready</span>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => toast.success(`${project.name} opened in quick view.`)}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 dark:border-white/10 dark:text-white/75"
                  >
                    <FiImage />
                    Quick view
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleCompare(project.id)}
                    className={`inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition ${selected ? 'bg-[#d4af37] text-[#1a2540]' : 'border border-slate-200 text-slate-700 dark:border-white/10 dark:text-white/75'}`}
                  >
                    <FiCheckCircle />
                    {selected ? 'Selected' : 'Compare project'}
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemove(project.id)}
                    className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 px-4 py-3 text-sm font-semibold text-rose-700 dark:border-rose-500/20 dark:text-rose-200"
                  >
                    <FiTrash2 />
                    Remove
                  </button>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}

function InquiriesSection({ data, filter, setFilter, page, setPage, onDelete }) {
  const [activeDetail, setActiveDetail] = useState(null)

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">All submitted inquiries</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-white/60">Filter by follow-up stage and track exactly where each lead stands.</p>
        </div>
        <label className="text-sm font-medium text-slate-600 dark:text-white/70">
          <span className="mr-3">Filter</span>
          <select
            value={filter}
            onChange={(event) => {
              setFilter(event.target.value)
              setPage(1)
            }}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
          >
            {['All', 'Pending', 'Contacted', 'Completed'].map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="space-y-4">
        {data.items.map((inquiry) => (
          <div key={inquiry.id} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-white/40">{new Date(inquiry.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                <h4 className="mt-2 text-lg font-bold text-slate-900 dark:text-white">{inquiry.serviceType}</h4>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-white/60">{inquiry.detail}</p>
              </div>
              <StatusPill status={inquiry.status} />
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setActiveDetail(activeDetail === inquiry.id ? null : inquiry.id)}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 dark:border-white/10 dark:text-white/75"
              >
                <FiMoreHorizontal />
                {activeDetail === inquiry.id ? 'Hide details' : 'View details'}
              </button>
              <button
                type="button"
                onClick={() => onDelete(inquiry.id)}
                className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 px-4 py-3 text-sm font-semibold text-rose-700 dark:border-rose-500/20 dark:text-rose-200"
              >
                <FiTrash2 />
                Delete inquiry
              </button>
            </div>

            {activeDetail === inquiry.id ? (
              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-white/65">
                This inquiry was routed through the dashboard-ready lead system and is now available for status updates, support follow-up, and CRM sync.
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500 dark:text-white/60">Page {data.page} of {data.totalPages}</p>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={data.page <= 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50 dark:border-white/10 dark:text-white/75"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={data.page >= data.totalPages}
            onClick={() => setPage((current) => Math.min(data.totalPages, current + 1))}
            className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50 dark:border-white/10 dark:text-white/75"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

function QuotesSection({ quotes, onStatusChange, onRequestModification }) {
  if (!quotes.length) {
    return (
      <EmptyState
        title="No quote requests yet"
        text="Once SSR Group sends your estimate or BOQ response, it will appear here with actions for review and follow-up."
      />
    )
  }

  return (
    <div className="space-y-4">
      {quotes.map((quote) => (
        <div key={quote.id} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-white/40">{new Date(quote.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              <h3 className="mt-2 text-lg font-bold text-slate-900 dark:text-white">{quote.service}</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-white/60">Quoted amount: <span className="font-semibold text-slate-900 dark:text-white">{quote.amount}</span></p>
              <p className="mt-1 text-sm text-slate-500 dark:text-white/60">Revision requests: {quote.revisionCount || 0}</p>
            </div>
            <StatusPill status={quote.status} />
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => toast.success(`PDF prepared for ${quote.service}.`)}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 dark:border-white/10 dark:text-white/75"
            >
              <FiDownload />
              Download PDF
            </button>
            <button
              type="button"
              onClick={() => onRequestModification(quote.id)}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 dark:border-white/10 dark:text-white/75"
            >
              <FiRefreshCw />
              Request modification
            </button>
            <button
              type="button"
              onClick={() => onStatusChange(quote.id, 'Reviewed')}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white"
            >
              <FiCheckCircle />
              Accept
            </button>
            <button
              type="button"
              onClick={() => onStatusChange(quote.id, 'Declined')}
              className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 px-4 py-3 text-sm font-semibold text-rose-700 dark:border-rose-500/20 dark:text-rose-200"
            >
              <FiXCircle />
              Decline
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

function SettingsSection({ settings, onSaveSettings, onChangePassword, onDownloadData, onDeleteAccount }) {
  const settingsForm = useForm({
    defaultValues: settings,
  })
  const passwordForm = useForm({
    resolver: zodResolver(passwordChangeSchema),
    mode: 'onChange',
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  useEffect(() => {
    settingsForm.reset(settings)
  }, [settings, settingsForm])

  const submitSettings = async (values) => {
    await onSaveSettings(values)
  }

  const submitPassword = async (values) => {
    await onChangePassword(values)
    passwordForm.reset()
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Notification preferences</h3>
        <form className="mt-5 space-y-6" onSubmit={settingsForm.handleSubmit(submitSettings)}>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ['notifications.emailQuotes', 'Email notifications for quotes'],
              ['notifications.emailProjectUpdates', 'Email project progress updates'],
              ['notifications.smsAlerts', 'SMS alerts for urgent updates'],
              ['notifications.smsMarketing', 'SMS offers and campaign updates'],
            ].map(([name, label]) => (
              <label key={name} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-700 dark:border-white/10 dark:bg-white/[0.03] dark:text-white/75">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-[#d4af37] focus:ring-[#d4af37]/30" {...settingsForm.register(name)} />
                {label}
              </label>
            ))}
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-white/40">Privacy</h4>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {[
                ['privacy.shareProfileWithConsultant', 'Allow assigned consultants to see my profile preferences'],
                ['privacy.allowSavedDataExports', 'Enable secure download of my stored dashboard data'],
              ].map(([name, label]) => (
                <label key={name} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-700 dark:border-white/10 dark:bg-white/[0.03] dark:text-white/75">
                  <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-[#d4af37] focus:ring-[#d4af37]/30" {...settingsForm.register(name)} />
                  {label}
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="submit" className="rounded-2xl bg-[#d4af37] px-5 py-3 text-sm font-bold text-[#1a2540]">Save preferences</button>
            <button type="button" onClick={onDownloadData} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 dark:border-white/10 dark:text-white/75">
              <FiDownload />
              Download my data
            </button>
          </div>
        </form>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr),minmax(320px,0.7fr)]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Change password</h3>
          <form className="mt-5 grid gap-5" onSubmit={passwordForm.handleSubmit(submitPassword)} noValidate>
            <div>
              <label htmlFor="currentPassword" className="text-sm font-medium text-slate-700 dark:text-white/80">Current password</label>
              <input id="currentPassword" type="password" className={inputClassName} {...passwordForm.register('currentPassword')} />
              {passwordForm.formState.errors.currentPassword ? <p className="mt-2 text-sm text-red-500">{passwordForm.formState.errors.currentPassword.message}</p> : null}
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="newPassword" className="text-sm font-medium text-slate-700 dark:text-white/80">New password</label>
                <input id="newPassword" type="password" className={inputClassName} {...passwordForm.register('newPassword')} />
                {passwordForm.formState.errors.newPassword ? <p className="mt-2 text-sm text-red-500">{passwordForm.formState.errors.newPassword.message}</p> : null}
              </div>
              <div>
                <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700 dark:text-white/80">Confirm new password</label>
                <input id="confirmPassword" type="password" className={inputClassName} {...passwordForm.register('confirmPassword')} />
                {passwordForm.formState.errors.confirmPassword ? <p className="mt-2 text-sm text-red-500">{passwordForm.formState.errors.confirmPassword.message}</p> : null}
              </div>
            </div>
            <button
              type="submit"
              disabled={!passwordForm.formState.isValid || passwordForm.formState.isSubmitting}
              className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white disabled:opacity-60 dark:bg-white dark:text-slate-900"
            >
              {passwordForm.formState.isSubmitting ? 'Updating...' : 'Update password'}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Linked accounts</h3>
            <div className="mt-5 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-white/10 dark:bg-white/[0.03]">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Google OAuth</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-white/60">{settings.linkedAccounts.google ? 'Connected and ready for secure sign-in.' : 'Not connected yet.'}</p>
              </div>
              <button type="button" className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 dark:border-white/10 dark:text-white/75">
                {settings.linkedAccounts.google ? 'Manage' : 'Connect'}
              </button>
            </div>
          </div>

          <div className="rounded-[28px] border border-rose-200 bg-rose-50 p-6 shadow-sm dark:border-rose-500/20 dark:bg-rose-500/10">
            <h3 className="text-xl font-bold text-rose-900 dark:text-rose-100">Danger zone</h3>
            <p className="mt-2 text-sm leading-6 text-rose-700 dark:text-rose-100/75">Delete your account and clear locally stored dashboard information. This action is irreversible in the current demo data layer.</p>
            <button
              type="button"
              onClick={onDeleteAccount}
              className="mt-5 inline-flex items-center gap-2 rounded-2xl border border-rose-300 px-5 py-3 text-sm font-semibold text-rose-800 dark:border-rose-400/30 dark:text-rose-100"
            >
              <FiTrash2 />
              Delete account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function HelpSection() {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Need help with a lead or quote?</h3>
        <div className="mt-5 space-y-4">
          {[
            { icon: FiPhone, label: 'Call support', value: SITE.phone, sub: 'Mon — Sat, 9 AM to 7 PM' },
            { icon: FiMail, label: 'Email support', value: SITE.email, sub: 'Replies usually within one business day' },
            { icon: FiShield, label: 'Data & security', value: 'HTTPS + rate limiting ready', sub: 'Prepared for backend-protected account actions' },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.03]">
              <div className="mt-1 rounded-full bg-[#d4af37]/15 p-3 text-[#d4af37]"><item.icon /></div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-white/40">{item.label}</p>
                <p className="mt-2 font-semibold text-slate-900 dark:text-white">{item.value}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-white/60">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Quick guidance</h3>
        <div className="mt-5 space-y-4 text-sm leading-6 text-slate-600 dark:text-white/65">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.03]">
            <p className="font-semibold text-slate-900 dark:text-white">How do I compare projects?</p>
            <p className="mt-2">Open Saved Projects and select up to two entries. The compare selector helps you shortlist what to discuss next with the SSR team.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.03]">
            <p className="font-semibold text-slate-900 dark:text-white">Why is my quote still pending?</p>
            <p className="mt-2">Pending means the team is still preparing pricing or a revision response. Sent means it is ready for review in your dashboard.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.03]">
            <p className="font-semibold text-slate-900 dark:text-white">Can I export my data?</p>
            <p className="mt-2">Yes. Use the Download my data button in Settings to export your currently stored dashboard information as JSON.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Profile() {
  const location = useLocation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const section = getSectionFromPath(location.pathname)
  const [inquiryFilter, setInquiryFilter] = useState('All')
  const [inquiryPage, setInquiryPage] = useState(1)
  const [compareIds, setCompareIds] = useState([])

  const profileQuery = useQuery({ queryKey: dashboardKeys.profile, queryFn: dashboardApi.getProfile })
  const savedProjectsQuery = useQuery({ queryKey: dashboardKeys.savedProjects, queryFn: dashboardApi.getSavedProjects })
  const inquiriesQuery = useQuery({
    queryKey: dashboardKeys.inquiries(inquiryFilter, inquiryPage),
    queryFn: () => dashboardApi.getInquiries({ filter: inquiryFilter, page: inquiryPage }),
  })
  const quotesQuery = useQuery({ queryKey: dashboardKeys.quotes, queryFn: dashboardApi.getQuotes })
  const settingsQuery = useQuery({ queryKey: dashboardKeys.settings, queryFn: dashboardApi.getSettings })

  const pageInfo = sectionTitles[section]

  const invalidateDashboard = () => queryClient.invalidateQueries({ queryKey: dashboardKeys.all })

  const profileMutation = useMutation({
    mutationFn: dashboardApi.updateProfile,
    onSuccess: () => {
      toast.success('Profile updated successfully.')
      invalidateDashboard()
    },
    onError: () => toast.error('Unable to update profile right now.'),
  })

  const avatarMutation = useMutation({
    mutationFn: dashboardApi.uploadAvatar,
    onSuccess: () => {
      toast.success('Avatar updated successfully.')
      invalidateDashboard()
    },
    onError: () => toast.error('Unable to upload avatar right now.'),
  })

  const removeProjectMutation = useMutation({
    mutationFn: dashboardApi.removeSavedProject,
    onSuccess: () => {
      toast.success('Removed from favorites.')
      invalidateDashboard()
    },
  })

  const deleteInquiryMutation = useMutation({
    mutationFn: dashboardApi.deleteInquiry,
    onSuccess: () => {
      toast.success('Inquiry deleted.')
      invalidateDashboard()
    },
  })

  const quoteStatusMutation = useMutation({
    mutationFn: ({ id, status }) => dashboardApi.updateQuoteStatus(id, status),
    onSuccess: (_, variables) => {
      toast.success(`Quote marked as ${variables.status}.`)
      invalidateDashboard()
    },
  })

  const quoteRevisionMutation = useMutation({
    mutationFn: dashboardApi.requestQuoteModification,
    onSuccess: () => {
      toast.success('Modification request sent.')
      invalidateDashboard()
    },
  })

  const settingsMutation = useMutation({
    mutationFn: dashboardApi.updateSettings,
    onSuccess: () => {
      toast.success('Settings updated successfully.')
      invalidateDashboard()
    },
  })

  const passwordMutation = useMutation({
    mutationFn: dashboardApi.changePassword,
    onSuccess: () => toast.success('Password changed successfully.'),
    onError: () => toast.error('Unable to change password right now.'),
  })

  const deleteAccountMutation = useMutation({
    mutationFn: dashboardApi.deleteAccount,
    onSuccess: () => {
      clearSession()
      toast.success('Account deleted and local demo data reset.')
      queryClient.clear()
      navigate('/login')
    },
  })

  const onLogout = () => {
    clearSession()
    toast.success('Logged out successfully.')
    navigate('/login')
  }

  const handleDownloadData = async () => {
    const data = await dashboardApi.getExportData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'ssr-dashboard-data.json'
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
    toast.success('Dashboard data export started.')
  }

  const handleDeleteAccount = () => {
    const confirmed = window.confirm('Delete this account and reset stored dashboard data?')
    if (confirmed) {
      deleteAccountMutation.mutate()
    }
  }

  const handleToggleCompare = (id) => {
    setCompareIds((current) => {
      if (current.includes(id)) return current.filter((entry) => entry !== id)
      if (current.length >= 2) {
        toast.error('You can compare up to 2 projects at a time.')
        return current
      }
      return [...current, id]
    })
  }

  const content = useMemo(() => {
    if (section === 'overview') {
      if (profileQuery.isLoading) return <LoadingBlock label="Loading profile overview..." />
      return (
        <ProfileOverviewSection
          profile={profileQuery.data}
          onSave={(values) => profileMutation.mutateAsync(values)}
          onUploadAvatar={(value) => avatarMutation.mutate(value)}
          onLogout={onLogout}
          isSaving={profileMutation.isPending}
          isUploading={avatarMutation.isPending}
        />
      )
    }

    if (section === 'saved-projects') {
      if (savedProjectsQuery.isLoading) return <LoadingBlock label="Loading saved projects..." />
      return (
        <SavedProjectsSection
          projects={savedProjectsQuery.data || []}
          compareIds={compareIds}
          onToggleCompare={handleToggleCompare}
          onRemove={(id) => removeProjectMutation.mutate(id)}
        />
      )
    }

    if (section === 'inquiries') {
      if (inquiriesQuery.isLoading) return <LoadingBlock label="Loading inquiries..." />
      return (
        <InquiriesSection
          data={inquiriesQuery.data}
          filter={inquiryFilter}
          setFilter={setInquiryFilter}
          page={inquiryPage}
          setPage={setInquiryPage}
          onDelete={(id) => deleteInquiryMutation.mutate(id)}
        />
      )
    }

    if (section === 'quote-requests') {
      if (quotesQuery.isLoading) return <LoadingBlock label="Loading quote requests..." />
      return (
        <QuotesSection
          quotes={quotesQuery.data || []}
          onStatusChange={(id, status) => quoteStatusMutation.mutate({ id, status })}
          onRequestModification={(id) => quoteRevisionMutation.mutate(id)}
        />
      )
    }

    if (section === 'settings') {
      if (settingsQuery.isLoading) return <LoadingBlock label="Loading settings..." />
      return (
        <SettingsSection
          settings={settingsQuery.data}
          onSaveSettings={(values) => settingsMutation.mutateAsync(values)}
          onChangePassword={(values) => passwordMutation.mutateAsync(values)}
          onDownloadData={handleDownloadData}
          onDeleteAccount={handleDeleteAccount}
        />
      )
    }

    return <HelpSection />
  }, [
    avatarMutation,
    compareIds,
    deleteInquiryMutation,
    inquiryFilter,
    inquiryPage,
    inquiriesQuery.data,
    inquiriesQuery.isLoading,
    onLogout,
    passwordMutation,
    profileMutation,
    profileQuery.data,
    profileQuery.isLoading,
    quoteRevisionMutation,
    quoteStatusMutation,
    quotesQuery.data,
    quotesQuery.isLoading,
    removeProjectMutation,
    savedProjectsQuery.data,
    savedProjectsQuery.isLoading,
    section,
    settingsMutation,
    settingsQuery.data,
    settingsQuery.isLoading,
  ])

  return (
    <div className="min-h-screen bg-slate-50 pb-28 pt-28 text-slate-900 dark:bg-[#08111e] dark:text-white md:pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[36px] border border-slate-200 bg-white/80 p-4 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.04] sm:p-6">
          <div className="grid gap-6 lg:grid-cols-[280px,minmax(0,1fr)]">
            <aside className="hidden lg:block">
              <div className="sticky top-28 rounded-[30px] border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/[0.03]">
                <div className="mb-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400 dark:text-white/40">Client Dashboard</p>
                  <h2 className="mt-2 text-2xl font-black text-slate-900 dark:text-white">My workspace</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-white/60">Review saved projects, inquiries, quote decisions, and personal preferences from one dashboard.</p>
                </div>

                <nav className="space-y-2">
                  {navItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <NavLink
                        key={item.key}
                        to={item.path}
                        end={item.path === '/profile'}
                        className={({ isActive }) =>
                          `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                            isActive
                              ? 'bg-[#d4af37] text-[#1a2540]'
                              : 'text-slate-600 hover:bg-white hover:text-slate-900 dark:text-white/65 dark:hover:bg-white/[0.05] dark:hover:text-white'
                          }`
                        }
                      >
                        <Icon />
                        {item.label}
                      </NavLink>
                    )
                  })}
                </nav>
              </div>
            </aside>

            <section className="min-w-0">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="mb-6 rounded-[30px] border border-slate-200 bg-gradient-to-r from-[#101d33] via-[#1a2540] to-[#0b1426] p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.22)] dark:border-white/10"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#d4af37]">Dashboard Section</p>
                    <h1 className="mt-3 text-3xl font-black tracking-tight">{pageInfo.title}</h1>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">{pageInfo.description}</p>
                  </div>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:border-[#d4af37]/40 hover:text-[#f1cf6f]"
                  >
                    <FiHelpCircle />
                    Need support?
                  </Link>
                </div>
              </motion.div>

              {content}
            </section>
          </div>
        </div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-2 py-2 backdrop-blur dark:border-white/10 dark:bg-[#08111e]/95 lg:hidden">
        <div className="mx-auto grid max-w-3xl grid-cols-6 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.key}
                to={item.path}
                end={item.path === '/profile'}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 rounded-2xl px-2 py-3 text-[11px] font-semibold transition ${
                    isActive
                      ? 'bg-[#d4af37] text-[#1a2540]'
                      : 'text-slate-500 dark:text-white/55'
                  }`
                }
              >
                <Icon className="text-base" />
                <span className="truncate">{item.label.split(' ')[0]}</span>
              </NavLink>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
