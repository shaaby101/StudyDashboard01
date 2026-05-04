'use client';

import { useApp } from '@/context/AppContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './register.module.css';

import { Suspense } from 'react';

const ROLE_OPTIONS = [
  { value: 'student', label: 'Student' },
  { value: 'faculty', label: 'Faculty' },
  { value: 'admin', label: 'Administrator' },
  { value: 'parent', label: 'Parent' },
];

function RegisterContent() {
  const { register, user, loadingUser } = useApp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleHint = searchParams.get('role') || 'student';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(roleHint);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user && !loadingUser) {
      router.replace(`/${user.role}`);
    }
  }, [user, loadingUser, router]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    const result = await register({ name, email, password, role });
    if (!result.ok) {
      setError(result.error || 'Registration failed.');
      setSubmitting(false);
      return;
    }

    router.replace(`/${result.user.role}`);
  };

  return (
    <div className={styles.page}>
      <div className={styles.backdrop} />
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.tag}>Create access</span>
          <h1>Register</h1>
          <p>Set up your role-specific Studesh workspace.</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label}>
            Full name
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your full name"
              required
            />
          </label>
          <label className={styles.label}>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@campus.edu"
              required
            />
          </label>
          <label className={styles.label}>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Create a password"
              required
            />
          </label>
          <label className={styles.label}>
            Role
            <select value={role} onChange={(event) => setRole(event.target.value)}>
              {ROLE_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.submit} disabled={submitting}>
            {submitting ? 'Creating...' : 'Create account'}
          </button>
        </form>

        <div className={styles.footer}>
          <span>Already have access?</span>
          <Link href={role ? `/login?role=${role}` : '/login'}>Sign in</Link>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterContent />
    </Suspense>
  );
}
