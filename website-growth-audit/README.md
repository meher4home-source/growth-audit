# Website Growth Audit — Setup & Deploy Guide

Ye app kya karta hai: koi bhi business owner apni website ka URL daalta hai, app free mein
Google ke engine se uski website scan karta hai, AI se ek plain-English report banata hai
"aap itna revenue kho rahe ho," aur $1,997 ke fix-package ka offer deta hai.

Neeche har step bilkul order mein hai — upar se neeche follow karo.

---

## Step 1 — Google PageSpeed API Key (Free)

1. https://console.cloud.google.com par jao, naya project banao (ya koi bhi existing)
2. Search bar mein "PageSpeed Insights API" dhoondho → **Enable** karo
3. Left menu → "Credentials" → "Create Credentials" → "API Key"
4. Jo key mile, usko copy karke rakho — ye `GOOGLE_PAGESPEED_API_KEY` hai

*Free quota kaafi zyada hai — chhoti-medium scale ke liye paisa nahi lagega.*

## Step 2 — NVIDIA API Key (Free)

1. https://build.nvidia.com par jao, account banao/login karo
2. Kisi bhi chat model (jaise Llama) page par jao, "Get API Key" button dabao
3. Jo key mile, copy karo — ye `NVIDIA_API_KEY` hai
4. Model ka exact naam wahi page par likha hoga (jaise `meta/llama-3.1-8b-instruct`) — usse
   `NVIDIA_MODEL` mein daal dena; agar naam thoda alag hai toh wahi use karo jo unki site
   par dikh raha ho

*Ye optional hai — agar key na bhi daalo, app kaam karega, bas AI-wala summary thoda
simple (rule-based) rahega.*

## Step 3 — Stripe Payment Link (Free to Setup)

1. https://stripe.com par account banao (business details fill karni padengi)
2. Dashboard → "Payment Links" → "Create Payment Link"
3. Product: "Website Growth Fix", Price: **$1,997**, one-time payment
4. Jo link generate ho (jaise `https://buy.stripe.com/xxxx`), copy karo — ye
   `NEXT_PUBLIC_STRIPE_PAYMENT_LINK` hai

*Stripe sirf tab paisa kaatta hai jab tumhe payment milti hai (~2.9% + 30 cents) — koi
upfront cost nahi.*

## Step 4 — (Optional) Lead-Alert Email — Resend

Har baar koi scan chalata hai, tumhe email mil jaaye taaki tum follow-up kar sako:

1. https://resend.com par free account banao
2. API key generate karo → `RESEND_API_KEY`
3. `NOTIFY_EMAIL` mein apna email daalo (jahan alert aani chahiye)
4. `NOTIFY_FROM` mein koi bhi verified sender address daalo (Resend guide karta hai domain
   verify karne mein)

*Ye skip bhi kar sakte ho abhi — baad mein add kar sakte ho.*

## Step 5 — Code Ko GitHub Par Daalo

1. https://github.com par account banao (agar nahi hai)
2. Naya repository banao (jaise `website-growth-audit`)
3. Is poori folder ko us repository mein push karo:

```bash
cd website-growth-audit
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/website-growth-audit.git
git push -u origin main
```

## Step 6 — Vercel Par Deploy Karo

1. https://vercel.com par GitHub account se login karo
2. "Add New Project" → apna `website-growth-audit` repo select karo
3. Framework automatically "Next.js" detect ho jaayega — kuch change mat karo
4. **Environment Variables** section mein ye sab daalo (Step 1-4 se jo mile):
   - `GOOGLE_PAGESPEED_API_KEY`
   - `NVIDIA_API_KEY`
   - `NVIDIA_MODEL`
   - `NEXT_PUBLIC_STRIPE_PAYMENT_LINK`
   - `RESEND_API_KEY` (optional)
   - `NOTIFY_EMAIL` (optional)
   - `NOTIFY_FROM` (optional)
5. "Deploy" dabao — 2-3 minute mein live ho jaayega, ek `.vercel.app` link milega

## Step 7 — Custom Domain (Optional, Zyada Professional Lagta Hai)

1. Koi bhi domain kharido (Namecheap/GoDaddy — $10-15/year)
2. Vercel project → Settings → Domains → apna domain daalo
3. Vercel jo DNS records deta hai, wahi apne domain-registrar mein daal do — 10-30 min mein
   live ho jaayega

---

## Ab Aage Kya Karo (Plan)

### Week 1 — Test Karo
- Khud ki ya kisi jaan-pehchaan wale business ki website daal ke scan chalao, dekho report
  theek aa raha hai ya nahi
- 5-10 alag-alag websites try karo (achhi aur kharab dono) — confirm karo scores realistic
  aa rahe hain

### Week 1-2 — Pehle Leads Laao
- Google Maps se apne target-country (US/Canada/UK/Australia/Germany) ki chhoti businesses
  dhoondho — restaurants, salons, clinics, local shops
- Unko email/LinkedIn message bhejo: *"I ran a free scan on your website — found something
  worth 2 minutes of your time: [tumhara link]"*
- Roz 20-30 businesses ko ye bhejo — ye sabse fast tareeka hai pehle scans generate karne ka

### Week 2-3 — Follow-Up Aur Close
- Jo bhi scan chalaye (Resend alert se pata chalega), unhe follow-up karo — call ya email
- Report ka reference do: "Aapke scan mein dikha $X/month lose ho raha hai — main ise fix
  kar sakta hoon $1,997 mein"
- Stripe link seedha bhej do payment ke liye

### Week 3-4 — Delivery System Banao
- Jab pehla client pay kare, actual fix (speed optimization, SEO basics, mobile fixes)
  khud karo ya freelancer (Upwork/Fiverr) se karwao — inka cost $200-400 hota hai, tumhara
  margin $1,500+ bacha rehta hai
- Har delivered project ko case-study banao — agle client ko dikhane ke liye proof milega

### Month 2 Onwards — Scale
- International reach ke liye same outreach US ke alawa Canada/UK/Australia/Germany ki
  businesses ko bhi bhejo — tool already sab jagah kaam karta hai, sirf outreach volume
  badhao
- Jo clients khush hain, unse referral maango — "koi aur business owner jaanti ho jise ye
  chahiye?"
- Ek chhota % clients monthly re-scan/maintenance ($99-199/month) mein convert karo —
  yehi recurring revenue banata hai

---

## Zaroori Baatein

- **Estimates fake nahi hain, illustrative hain** — app kabhi "guaranteed" nahi bolta, sirf
  "estimated range" bolta hai. Isko change mat karna, ye legal safety ke liye zaroori hai.
- **Recovered/paid amount seedha Stripe se tumhare account mein aayega** — koi third-party
  money-handling complexity nahi.
- Jaise-jaise scale badhega, Google PageSpeed API aur NVIDIA API dono ki free-tier limit se
  upar ja sakte ho — tab unka paid-tier bahut saste rate par milta hai (revenue se easily
  cover hota hai).
