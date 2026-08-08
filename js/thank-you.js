import { SITE, FORM, FOOTER } from './content.js';

const $ = selector => document.querySelector(selector);
document.title = `${FORM.thankYou.title} | ${SITE.title}`;
$('meta[name="description"]').content = FORM.thankYou.body;
$('.thank-you-brand img').alt = SITE.logoAlt;
$('.thank-you .eyebrow').textContent = FORM.thankYou.eyebrow;
$('.thank-you .h2').textContent = FORM.thankYou.title;
$('.thank-you .lede').textContent = FORM.thankYou.body;
$('.thank-you-primary').textContent = FORM.thankYou.primary;
$('.thank-you-secondary').textContent = FORM.thankYou.secondary;
$('.thank-you-secondary').href = SITE.mainSite;
$('.thank-you-foot').textContent = `© ${new Date().getFullYear()} ${FOOTER.copyright}`;
