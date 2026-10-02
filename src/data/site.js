// Global site content. Anything left null is simply not rendered.
export const site = {
  name: 'Ahmed Hossam',
  role: 'Frontend Developer',
  tagline: 'Creative Digital Builder',

  email: 'ah7428839@gmail.com',

  // display: how it reads on the page; href: E.164 for tel: links
  phone: { display: '+20 121 070 5553', href: '+201210705553' },

  // Downloadable CV (file lives in /public/cv)
  cv: '/cv/Ahmed_Hossam_CV.pdf',

  socials: [
    { label: 'GitHub', href: 'https://github.com/ahmedhossam231169' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ahmed-hossam-843391366' },
  ],

  // shown as a small meta label in the hero and under About
  location: 'Alexandria, EG',
  languages: 'Arabic / English',
  availability: 'Open to work',
}

// BASE_URL keeps the link working if the site is deployed under a sub-path (e.g. GitHub Pages).
export const cvHref = site.cv && `${import.meta.env.BASE_URL}${site.cv.replace(/^\//, '')}`

export const sections = [
  { id: 'about', index: '01', label: 'About' },
  { id: 'journey', index: '02', label: 'Journey' },
  { id: 'work', index: '03', label: 'Work' },
  { id: 'skills', index: '04', label: 'Skills' },
  { id: 'contact', index: '05', label: 'Contact' },
]
