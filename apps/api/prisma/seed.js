const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // ── Admin user ──────────────────────────────────────────────────────
  const password = await bcrypt.hash('admin123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'admin@xainhotel.com' },
    update: {},
    create: {
      fullname: 'Admin User',
      email: 'admin@xainhotel.com',
      password,
      isAdmin: 1,
      userLevel: 1,
      status: 1,
    },
  });
  console.log('✅ Admin user:', user.email, '/ Password: admin123');

  // ── Hotel settings ──────────────────────────────────────────────────
  const settingCount = await prisma.commonSetting.count();
  if (settingCount === 0) {
    await prisma.commonSetting.create({
      data: {
        hotelName: 'Xain Hotel',
        address: 'Cantonments, Accra, Ghana',
        phone: '+233 30 100 0000',
        email: 'info@xainhotel.com',
        currency: 'GHS',
        currencySymbol: 'GH₵',
        timezone: 'Africa/Accra',
      },
    });
    console.log('✅ Hotel settings created');
  }

  // ── 6 Room Types ────────────────────────────────────────────────────
  const roomTypes = [
    {
      name: 'Classic Room',
      description: 'Refined comfort with rich Ghanaian textile accents and all modern amenities.',
      price: 250,
      capacity: 2,
      image: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1779588185/one-king-size-bed-hotel-room_114579-12159_aadqgg.avif',
    },
    {
      name: 'Deluxe Garden Room',
      description: 'A serene garden-facing retreat — king bed, private balcony and lush tropical views.',
      price: 350,
      capacity: 2,
      image: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1779588185/sunset-pool_1203-3191_wg2dwy.jpg',
    },
    {
      name: 'Executive Room',
      description: 'Spacious executive comfort — dedicated work area, express check-in and club lounge access.',
      price: 420,
      capacity: 3,
      image: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1779588185/tropical-hotel-holiday-background-resort_1203-4943_raibay.avif',
    },
    {
      name: 'Kente Suite',
      description: 'Our signature suite — kente-woven headboards, premium linens, panoramic city views.',
      price: 480,
      capacity: 3,
      image: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1779588183/modern-studio-apartment-design-with-bedroom-living-space_1262-12375_faldtb.avif',
    },
    {
      name: 'Sky Penthouse Suite',
      description: 'Floor-to-ceiling views, private rooftop terrace and bespoke in-suite dining above the Accra skyline.',
      price: 750,
      capacity: 4,
      image: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1779588183/beautiful-aerial-shot-coastal-city-sea_181624-599_fjrnqi.avif',
    },
    {
      name: 'Presidential Suite',
      description: 'An entire floor of opulence — private terrace, personal butler, bespoke dining.',
      price: 950,
      capacity: 6,
      image: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1779588183/pillow-bed_74190-6244_sueu3d.avif',
    },
  ];

  const createdTypes = [];
  for (const rt of roomTypes) {
    const existing = await prisma.roomType.findFirst({ where: { name: rt.name } });
    if (!existing) {
      const created = await prisma.roomType.create({ data: rt });
      createdTypes.push(created);
      console.log('✅ Room type:', created.name);
    } else {
      createdTypes.push(existing);
      console.log('⚡ Room type exists:', existing.name);
    }
  }

  // ── 6 Rooms (one per type) ──────────────────────────────────────────
  const rooms = [
    { roomNo: '101', floorId: 1, typeName: 'Classic Room',         description: 'Ground floor, garden side, quiet corner room.' },
    { roomNo: '201', floorId: 2, typeName: 'Deluxe Garden Room',   description: 'Second floor, overlooking tropical garden.' },
    { roomNo: '301', floorId: 3, typeName: 'Executive Room',       description: 'Third floor city view, premium workspace.' },
    { roomNo: '401', floorId: 4, typeName: 'Kente Suite',          description: 'Fourth floor, kente-weave décor, panoramic views.' },
    { roomNo: '501', floorId: 5, typeName: 'Sky Penthouse Suite',  description: 'Fifth floor, private rooftop terrace access.' },
    { roomNo: '601', floorId: 6, typeName: 'Presidential Suite',   description: 'Entire sixth floor, full butler service.' },
  ];

  for (const r of rooms) {
    const roomType = createdTypes.find(t => t.name === r.typeName);
    if (!roomType) continue;
    const existing = await prisma.room.findUnique({ where: { roomNo: r.roomNo } });
    if (!existing) {
      await prisma.room.create({
        data: {
          roomNo: r.roomNo,
          roomTypeId: roomType.id,
          floorId: r.floorId,
          status: 'available',
          description: r.description,
        },
      });
      console.log('✅ Room:', r.roomNo, '-', r.typeName);
    } else {
      console.log('⚡ Room exists:', r.roomNo);
    }
  }

  // ── Sample department ───────────────────────────────────────────────
  const deptCount = await prisma.department.count();
  if (deptCount === 0) {
    const depts = ['Front Office', 'Housekeeping', 'Food & Beverage', 'Maintenance', 'Security'];
    for (const name of depts) {
      await prisma.department.create({ data: { name } });
    }
    console.log('✅ Departments seeded');
  }

  console.log('\n🏨 Xain Hotel seeded successfully!');
  console.log('   Login: admin@xainhotel.com / admin123');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
