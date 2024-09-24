export default defineNuxtRouteMiddleware(async (to) => {
  const supabase = useSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Redirect to login if user is not logged in and not on login page
  if (!user) {
    if (to.path != '/login') return navigateTo('/login')
  }
  else {
    // Fetch users based on their role
    const { data: userData, error } = await supabase.from('users').select('role').eq('id', user.id).maybeSingle()
    const userRole = userData?.role

    // Handle error or missing role
    if (error || !userRole) return navigateTo('/login')

    // Redirect from login to the appropriate page
    const roleBasedRoutes = {
      admin: '/admin',
      kelas: '/kelas'
    }

    // Restrict access to dashboard based on role
    if (to.path.startsWith('/admin') && userRole != 'admin') return navigateTo('/login')
    if (to.path.startsWith('/kelas') && userRole != 'kelas') return navigateTo('/login')
    
    if (to.path == '/login') return navigateTo(roleBasedRoutes[userRole] || '/')
  }
})