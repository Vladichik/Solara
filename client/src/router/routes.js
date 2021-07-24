const routes = [
  {
    path: '/authenticate',
    component: () => import('layouts/AuthenticationLayout.vue'),
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '/home', component: () => import('pages/Home.vue') },
      {
        path: '/my-account',
        component: () => import('pages/MyAccount.vue'),
        meta: { requiresAuth: true },
        children: [
          { path: '', component: () => import('components/my-account/MainTabs.vue') },
        ],
      },
      { path: '/favorites', component: () => import('pages/Favorites.vue') },
      { path: '/solara-pro', component: () => import('pages/SolaraPro.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
