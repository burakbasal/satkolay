'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { z } from 'zod'

import { createClient } from '@/utils/supabase/server'

// List of blocked temporary email domains
const BLOCKED_DOMAINS = [
    'mail.tm',
    'temp-mail.org',
    '10minutemail.com',
    'yopmail.com',
    'guerrillamail.com',
    'throwawaymail.com',
]

const signupSchema = z.object({
    email: z.string().email().refine((email) => {
        const domain = email.split('@')[1]
        return !BLOCKED_DOMAINS.includes(domain)
    }, {
        message: "Güvenlik gereği geçici (disposable) mail adresleri kabul edilmemektedir.",
    }),
    password: z.string().min(6, "Şifre en az 6 karakter olmalıdır."),
})

export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    // Validate input using Zod
    const result = signupSchema.safeParse({ email, password })

    if (!result.success) {
        // Return the first error message
        return { error: result.error.issues[0].message }
    }

    const origin = (await headers()).get('origin')

    // GLOBAL REGISTRATION LOCK
    const { data: settings } = await supabase.from('platform_settings').select('is_registration_open').eq('id', 1).single();
    if (settings && settings.is_registration_open === false) {
        return { error: 'Yeni üye kayıtları şu an için durdurulmuştur. Lütfen daha sonra tekrar deneyiniz.' };
    }

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${origin}/auth/callback`,
        },
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    redirect('/')
}
