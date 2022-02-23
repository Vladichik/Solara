const routes = [
  {
    path: '/authenticate',
    component: () => import('layouts/AuthenticationLayout.vue'),
  },
  {
    path: '/orvibo-oauth/:code?',
    component: () => import('layouts/OrviboAuth.vue'),
  },
  {
    path: '/',
    redirect: '/home',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '/home', component: () => import('pages/Home.vue') },
      {
        path: '/my-account',
        component: () => import('pages/MyAccount.vue'),
        meta: { requiresAuth: true },
        children: [
          { path: '', component: () => import('pages/my-account/MainTabs.vue') },
          { path: '/payment-info', component: () => import('pages/my-account/PaymentInfo.vue') },
          { path: '/personal-info', component: () => import('pages/my-account/PersonalInfo.vue') },
          { path: '/address', component: () => import('pages/my-account/Addresses.vue') },
          { path: '/products-info', component: () => import('pages/my-account/ProductsInfo.vue') },
          { path: '/contact-us', component: () => import('pages/my-account/ContactUs.vue') },
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
