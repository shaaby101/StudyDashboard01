'use client';

import { useApp } from '@/context/AppContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './login.module.css';

import { Suspense } from 'react';

function LoginContent() {
  const { login, user, loadingUser } = useApp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleHint = searchParams.get('role');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

    const result = await login({ email, password });
    if (!result.ok) {
      setError(result.error || 'Login failed.');
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
          <span className={styles.tag}>Studesh Access</span>
          <h1>Sign in</h1>
          <p>Continue to your role dashboard{roleHint ? ` as ${roleHint}` : ''}.</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label}>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@campus.edu"
              required
              autoComplete="email"
            />
          </label>
          <label className={styles.label}>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />
          </label>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.submit} disabled={submitting}>
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className={styles.footer}>
          <span>New to Studesh?</span>
          <Link href={roleHint ? `/register?role=${roleHint}` : '/register'}>Create an account</Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}
