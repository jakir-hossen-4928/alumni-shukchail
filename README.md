
# শুকচাইল স্কুল অ্যালামনাই পোর্টাল

![শুকচাইল স্কুল লোগো](https://i.ibb.co/NgkLwVm3/shukchail-logo.jpg)

## প্রকল্প পরিচিতি

শুকচাইল সরকারি প্রাথমিক বিদ্যালয় অ্যালামনাই পোর্টাল হল একটি ওয়েব অ্যাপ্লিকেশন যা স্কুলের প্রাক্তন ছাত্র-ছাত্রীদের একত্রিত করার জন্য তৈরি করা হয়েছে। এই অ্যাপ্লিকেশনের মাধ্যমে অ্যালামনাইরা নিবন্ধন করতে পারেন, তাদের প্রোফাইল আপডেট করতে পারেন, আসন্ন ইভেন্টের তথ্য জানতে পারেন এবং অন্যান্য প্রাক্তন শিক্ষার্থীদের সাথে যোগাযোগ করতে পারেন।

## প্রধান বৈশিষ্ট্য

- **ব্যবহারকারী অ্যাকাউন্ট ম্যানেজমেন্ট**: নিবন্ধন, লগইন, পাসওয়ার্ড পুনরুদ্ধার
- **প্রোফাইল ম্যানেজমেন্ট**: ব্যক্তিগত তথ্য, শিক্ষাগত যোগ্যতা, পেশাগত তথ্য আপডেট করা
- **প্রোফাইল ছবি আপলোড**: ব্যবহারকারীরা তাদের প্রোফাইল ছবি আপলোড করতে পারেন
- **পেমেন্ট সিস্টেম**: বার্ষিক চাঁদা বা অনুদান প্রদান করার জন্য
- **অ্যাডমিন প্যানেল**: সদস্য অনুমোদন, পেমেন্ট যাচাই, সিস্টেম সেটিংস ম্যানেজমেন্ট
- **ইভেন্ট ক্যালেন্ডার**: আসন্ন অ্যালামনাই ইভেন্টের তথ্য

## প্রযুক্তিগত স্ট্যাক

- **ফ্রন্টএন্ড**: React, TypeScript, Tailwind CSS, Shadcn UI
- **ব্যাকএন্ড**: Firebase (Authentication, Cloud Firestore, Storage)
- **স্টেট ম্যানেজমেন্ট**: React Query
- **রাউটিং**: React Router
- **ফর্ম ভ্যালিডেশন**: React Hook Form, Zod

## প্রজেক্ট স্ট্রাকচার

```
শুকচাইল-অ্যালামনাই-পোর্টাল/
├── public/
│   ├── favicon.ico
│   └── placeholder.svg
├── src/
│   ├── components/
│   │   ├── ui/                 - UI কম্পোনেন্টস (shadcn/ui)
│   │   ├── DashboardLayout.tsx - ড্যাশবোর্ড লেআউট
│   │   ├── DashboardNavbar.tsx - ড্যাশবোর্ড নেভবার
│   │   ├── DashboardSidebar.tsx- ড্যাশবোর্ড সাইডবার
│   │   ├── DashboardFooter.tsx - ড্যাশবোর্ড ফুটার
│   │   ├── Footer.tsx          - সাইট ফুটার
│   │   ├── Header.tsx          - সাইট হেডার
│   │   ├── ProfileImageUploader.tsx - প্রোফাইল ছবি আপলোড কম্পোনেন্ট
│   │   ├── ProtectedRoute.tsx  - সুরক্ষিত রাউট কম্পোনেন্ট
│   │   └── PublicLayout.tsx    - পাবলিক পেজ লেআউট
│   │
│   ├── contexts/
│   │   └── AuthContext.tsx     - অথেনটিকেশন কনটেক্সট
│   │
│   ├── hooks/
│   │   └── use-mobile.tsx      - মোবাইল ডিভাইস ডিটেকশন হুক
│   │
│   ├── lib/
│   │   ├── api.ts              - API ফাংশন
│   │   ├── firebase.ts         - Firebase কনফিগারেশন
│   │   ├── types.ts            - টাইপ ডেফিনিশন
│   │   └── utils.ts            - ইউটিলিটি ফাংশন
│   │
│   ├── pages/
│   │   ├── admin/              - অ্যাডমিন পেজ
│   │   ├── dashboard/          - ইউজার ড্যাশবোর্ড পেজ
│   │   ├── home/               - হোমপেজ
│   │   ├── About.tsx           - আমাদের সম্পর্কে পেজ
│   │   ├── Contact.tsx         - যোগাযোগ পেজ
│   │   ├── Events.tsx          - ইভেন্টস পেজ
│   │   ├── ForgotPassword.tsx  - পাসওয়ার্ড পুনরুদ্ধার পেজ
│   │   ├── Login.tsx           - লগইন পেজ
│   │   ├── NotFound.tsx        - ৪০৪ এরর পেজ
│   │   ├── Register.tsx        - নিবন্ধন পেজ
│   │   └── Unauthorized.tsx    - অননুমোদিত অ্যাকসেস পেজ
│   │
│   ├── routes/
│   │   └── AppRoutes.tsx       - অ্যাপ্লিকেশন রাউট কনফিগারেশন
│   │
│   ├── App.tsx                 - মূল অ্যাপ কম্পোনেন্ট
│   └── main.tsx                - অ্যাপ এন্ট্রি পয়েন্ট
│
└── README.md                   - প্রজেক্ট ডকুমেন্টেশন
```

## ডাটাবেস স্ট্রাকচার

Firebase Firestore ডাটাবেস ব্যবহার করা হয়েছে নিম্নলিখিত কালেকশন সহ:

### কালেকশন: `users`

```javascript
{
  uid: string,                     // Firebase Auth UID
  email: string,                   // ইমেইল
  name: string,                    // নাম
  role: 'user' | 'admin',          // ভূমিকা
  profileImageUrl: string,         // প্রোফাইল ইমেজ URL
  phoneNumber: string,             // মোবাইল নম্বর
  approved: boolean,               // অ্যাডমিন দ্বারা অনুমোদিত কিনা
  approvedAt: timestamp,           // অনুমোদনের সময়
  approvedBy: string,              // অনুমোদনকারী অ্যাডমিন ID
  gender: 'male' | 'female' | 'other', // লিঙ্গ
  birthDate: timestamp,            // জন্ম তারিখ
  nationalIdOrBirthCert: string,   // জাতীয় পরিচয়পত্র/জন্ম সনদ
  currentAddress: string,          // বর্তমান ঠিকানা
  permanentAddress: string,        // স্থায়ী ঠিকানা
  occupation: string,              // পেশা
  currentLocation: string,         // বর্তমান অবস্থান
  studyYears: string,              // স্কুলে পড়ার বছর
  passYear: string,                // পাসের বছর
  secondaryEducation: string,      // মাধ্যমিক শিক্ষা
  higherEducation: string,         // উচ্চশিক্ষা
  currentWorkplace: string,        // কর্মস্থল
  workExperience: string,          // কাজের অভিজ্ঞতা
  specialContribution: string,     // বিশেষ অবদান
  suggestions: string,             // পরামর্শ
  createdAt: timestamp,            // অ্যাকাউন্ট তৈরির সময়
  updatedAt: timestamp             // অ্যাকাউন্ট আপডেটের সময়
}
```

### কালেকশন: `payments`

```javascript
{
  id: string,                      // পেমেন্ট ID
  userId: string,                  // ইউজার ID (Firebase Auth UID)
  amount: number,                  // টাকার পরিমাণ
  purpose: 'membership' | 'donation' | 'event', // পেমেন্টের উদ্দেশ্য
  method: 'bkash' | 'nagad' | 'rocket' | 'bank', // পেমেন্ট পদ্ধতি
  transactionId: string,           // ট্রানজেকশন ID
  status: 'pending' | 'verified' | 'rejected', // পেমেন্ট স্টেটাস
  verifiedAt: timestamp,           // যাচাইয়ের সময়
  verifiedBy: string,              // যাচাইকারী অ্যাডমিন ID
  year: number,                    // বার্ষিক চাঁদা বছর
  note: string,                    // অতিরিক্ত মন্তব্য
  createdAt: timestamp,            // পেমেন্টের সময়
  updatedAt: timestamp             // আপডেটের সময়
}
```

### কালেকশন: `events`

```javascript
{
  id: string,                      // ইভেন্ট ID
  title: string,                   // শিরোনাম
  description: string,             // বিবরণ
  date: timestamp,                 // তারিখ
  location: string,                // অবস্থান
  imageUrl: string,                // ইভেন্ট ছবি URL
  registrationRequired: boolean,   // রেজিস্ট্রেশন প্রয়োজন
  registrationFee: number,         // রেজিস্ট্রেশন ফি
  status: 'upcoming' | 'ongoing' | 'past', // ইভেন্ট স্টেটাস
  createdAt: timestamp,            // তৈরির সময়
  updatedAt: timestamp             // আপডেটের সময়
}
```

## সিস্টেম ব্যবহারের নির্দেশিকা

### ব্যবহারকারীদের জন্য

1. **নিবন্ধন করুন**: `/register` পেজে গিয়ে নিবন্ধন ফর্ম পূরণ করুন
2. **লগইন করুন**: `/login` পেজে গিয়ে লগইন করুন
3. **প্রোফাইল আপডেট করুন**: `/dashboard/profile` পেজে গিয়ে আপনার তথ্য আপডেট করুন
4. **পেমেন্ট করুন**: `/dashboard/payment` পেজে গিয়ে বার্ষিক চাঁদা পরিশোধ করুন

### অ্যাডমিনদের জন্য

1. **সদস্য অনুমোদন**: `/admin/users` পেজে গিয়ে নতুন সদস্যদের অনুমোদন দিন
2. **পেমেন্ট যাচাই**: `/admin/payments` পেজে গিয়ে পেমেন্ট যাচাই করুন
3. **সিস্টেম সেটিংস**: `/admin/settings` পেজে গিয়ে সিস্টেম সেটিংস পরিবর্তন করুন

## ইনস্টলেশন ও রান করার নির্দেশনা

```bash
# প্রজেক্ট ক্লোন করুন
git clone <your-repo-url>

# প্রজেক্ট ডিরেক্টরিতে যান
cd shukchail-alumni-portal

# ডিপেন্ডেন্সি ইনস্টল করুন
npm install

# ডেভেলপমেন্ট সার্ভার চালু করুন
npm run dev
```

## বিশেষ তথ্য

- **অ্যাডমিন লগইন**: 
  - ইমেইল: admin@example.com
  - পাসওয়ার্ড: admin123

---

© ২০২৩-২০২৪ শুকচাইল সরকারি প্রাথমিক বিদ্যালয় অ্যালামনাই। সর্বস্বত্ব সংরক্ষিত।
