cd C:\Users\TGNE\Desktop\newprojects\xain-hotel-next
git add apps/web/vercel.json apps/web/.env.example
git commit -m "fix: point frontend to live API + fix vercel.json rewrite URL

- vercel.json: replace YOUR_API_URL placeholder with 360-hotel-api.vercel.app
- .env.example: update NEXT_PUBLIC_API_URL to production API"
git push
