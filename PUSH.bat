cd C:\Users\TGNE\Desktop\newprojects\xain-hotel-next
git add apps/api/vercel.json apps/api/package.json apps/api/prisma/schema.prisma apps/api/src/index.ts apps/web/vercel.json
git commit -m "fix: Vercel serverless API setup + Neon directUrl + CORS

- Add apps/api/vercel.json: @vercel/node build, route all traffic to src/index.ts
- Add postinstall: prisma generate so Prisma client is built on Vercel deploy
- Add DIRECT_URL to prisma schema for Neon connection pooling
- Fix index.ts: proper serverless export, skip listen() on Vercel
- Broaden CORS to allow *.vercel.app preview URLs
- Add apps/web/vercel.json for frontend build config"
git push
