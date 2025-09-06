import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tvvvxiuhegatrsaxhibd.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2dnZ4aXVoZWdhdHJzYXhoaWJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MzA0MTMsImV4cCI6MjA3MjUwNjQxM30.FAxzOWWIloVJSlkGTgVDjBuKiOXiRjkvb8N6AtlfrPE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Função para obter o token do usuário autenticado
export const getAuthToken = () => {
  const session = supabase.auth.getSession()
  return session?.data?.session?.access_token || null
}

// Função para obter o usuário autenticado
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Função para fazer logout
export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// Função para fazer login
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw error
  return data
}

// Função para registrar
export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  if (error) throw error
  return data
}

