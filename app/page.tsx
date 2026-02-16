"use client";

import { useState } from "react";

export default function Home() {
  const [idNumber, setIdNumber] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [errors, setErrors] = useState({
    idNumber: "",
    serialNumber: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError("");

    // Reset errors
    const newErrors = {
      idNumber: "",
      serialNumber: "",
    };

    // Validate ID Number
    if (!idNumber.trim()) {
      newErrors.idNumber = "رقم الهوية الوطنية / رقم الإقامة / رقم المنشأة مطلوب";
    }

    // Validate Serial Number
    if (!serialNumber.trim()) {
      newErrors.serialNumber = "رقم المرجع مطلوب.";
    }

    setErrors(newErrors);

    // If there are errors, stop submission
    if (newErrors.idNumber || newErrors.serialNumber) {
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(
        `/api/document-mappings?idNumber=${encodeURIComponent(
          idNumber.trim()
        )}&serialNumber=${encodeURIComponent(serialNumber.trim())}`
      );

      if (!response.ok) {
        return;
      }

      const data = await response.json();
      const link = document.createElement("a");
      link.href = data.fileUrl;
      link.download = data.fileName || "document.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIdNumber("");
      setSerialNumber("");
      setErrors({ idNumber: "", serialNumber: "" });
    } catch (error) {
      console.error(error);
      setFormError("تعذر تحميل المستند. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-[#1b1f22]">
      {/* Skip to content link */}
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-4 focus:z-50 focus:rounded-lg focus:bg-[#0038FF] focus:px-4 focus:py-2 focus:text-sm focus:text-white focus:shadow-lg"
      >
        تخطي إلى المحتوى الرئيسي
      </a>

      {/* Top utility bar */}
      <div className="hidden border-b border-gray-100 bg-white lg:block">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-3">
          {/* Right Side: Links & Disclosure */}
          <div className="flex items-center gap-6">
            <a
              href="https://www.alrajhibank.com.sa"
              className="text-xs font-normal text-[#5b6770] hover:text-[#0038FF]"
            >
              قواعد الافصاح عن أسعار المنتجات التمويلية
            </a>
          </div>

          {/* Left Side: Icons & Nav */}
          <div className="flex items-center gap-6">
            <nav className="flex items-center gap-6 text-xs text-[#5b6770]">
              <a
                href="https://www.alrajhibank.com.sa/About-alrajhi-bank/Media-Center"
                className="hover:text-[#0038FF]"
              >
                المركز الاعلامي
              </a>
              <a
                href="https://www.alrajhibank.com.sa/forms/submit-your-request"
                className="hover:text-[#0038FF]"
              >
                المساعدة والدعم
              </a>
            </nav>
            {/* Utility Icons */}
            <div className="flex items-center gap-4 border-r border-gray-200 pr-4 text-[#0038FF]">
              <button aria-label="Text Size" className="hover:opacity-80">
                <span className="font-bold text-sm">AA</span>
              </button>
              <button aria-label="Accessibility Mode" className="hover:opacity-80">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              </button>
              <button aria-label="Zoom" className="hover:opacity-80">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6"
                  />
                </svg>
              </button>
              <button aria-label="Chat" className="hover:opacity-80">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4">
          {/* Logo */}
          <a href="https://www.alrajhibank.com.sa" className="flex-shrink-0">
            <img
              src="https://www.alrajhibank.com.sa/-/media/Project/AlRajhi/ARBRevamp/Temp/AlRajhiBankLogo.svg?h=53&iar=0&w=155&hash=CDCB0DBCE8B0FB5F773D371AC48A083E"
              alt="مصرف الراجحي"
              className="h-10 w-auto lg:h-12"
            />
          </a>

          {/* Navigation Container (Pills + Links) */}
          <div className="hidden flex-1 items-center justify-center gap-8 lg:flex xl:gap-12">
            {/* Pills */}
            <div className="flex items-center rounded-full bg-[#f5f7f8] p-1">
              <a
                href="https://www.alrajhibank.com.sa/Personal"
                className="rounded-full bg-white px-6 py-2 text-sm font-bold text-[#1b1f22] shadow-sm ring-1 ring-black/5"
              >
                الأفراد
              </a>
              <a
                href="https://www.alrajhibank.com.sa/Business"
                className="rounded-full px-6 py-2 text-sm font-medium text-[#5b6770] hover:text-[#1b1f22]"
              >
                الأعمال
              </a>
            </div>

            {/* Links */}
            <nav className="flex items-center gap-6 text-[15px] font-medium text-[#1b1f22]">
              <a href="#" className="hover:text-[#0038FF]">
                الحسابات
              </a>
              <a href="#" className="hover:text-[#0038FF]">
                البطاقات
              </a>
              <a href="#" className="hover:text-[#0038FF]">
                التمويل
              </a>
              <a href="#" className="hover:text-[#0038FF]">
                التأمين
              </a>
              <a href="#" className="hover:text-[#0038FF]">
                العروض
              </a>
              <a href="#" className="hover:text-[#0038FF]">
                الفئات
              </a>
            </nav>
          </div>

          {/* Left Actions */}
          <div className="flex items-center gap-4">
            <button
              className="hidden items-center gap-2 text-sm font-medium text-[#1b1f22] lg:flex"
              aria-label="Switch to English"
            >
              English
              <img
                src="https://www.alrajhibank.com.sa/img/arb-language-switcher/en.svg"
                alt=""
                className="h-5 w-5 rounded-full"
              />
            </button>
            <button
              className="hidden h-10 w-10 items-center justify-center text-[#1b1f22] lg:flex"
              aria-label="بحث"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
            <button className="rounded-xl bg-[#0038FF] px-6 py-3 text-sm font-bold text-white transition-all hover:bg-[#0030dd] hover:shadow-lg hover:shadow-blue-900/20">
              تسجيل الدخول
            </button>
          </div>
        </div>
      </header>

      {/* Hero Content */}
      <main id="content">
        <section className="relative overflow-hidden bg-white">
          {/* Background Curve Shape */}
          <div className="absolute inset-0 pointer-events-none">
            <svg
              className="absolute left-0 top-0 h-full w-[60%] lg:w-[55%]"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0 0H100V100H0V0Z" fill="none" />
              <path
                d="M0 0 H100 L75 100 H0 V0 Z"
                fill="#f4f7fe"
                className="hidden"
              />
              <path d="M0 0 H90 Q65 50 85 100 H0 V0 Z" fill="#f4f7fe" />
            </svg>
            <div
              className="absolute left-0 top-0 h-full w-[60%] bg-gradient-to-r from-blue-50/50 to-transparent opacity-50 lg:w-[55%]"
              style={{ clipPath: "path('M0 0 H90 Q65 50 85 100 H0 V0 Z')" }}
            ></div>
          </div>

          <div className="relative mx-auto max-w-[1400px] px-6">
            <div className="flex flex-col gap-12 py-16 lg:min-h-[600px] lg:flex-row lg:items-center lg:py-0">
              {/* Text Content (Right in RTL) */}
              <div className="relative z-10 flex-1 pt-12 text-right lg:pr-12 lg:pt-0">
                <h1 className="text-4xl font-bold leading-tight text-[#002552] lg:text-5xl lg:leading-[1.2]">
                  نموذج التحقق من
                  <br />
                  <span className="text-[#002552]">مستندات</span>
                </h1>
                <p className="mt-4 text-lg text-[#5b6770]">
                  نموذج التحقق من مستندات
                </p>
              </div>

              {/* Hero Image (Left in RTL) */}
              <div className="relative z-10 flex flex-1 items-end justify-center lg:h-[600px] lg:justify-end">
                <img
                  src="https://www.alrajhibank.com.sa/-/media/Project/AlRajhi/ARBRevamp/Home/Personal/08.webp?iar=0&hash=1E39DE7169FBE9DCE1C60A9A937E046A"
                  alt="Al Rajhi Bank"
                  className="h-auto max-w-full origin-bottom-left transform object-contain lg:h-full lg:w-auto lg:scale-105"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="bg-[#f9fafb] py-16">
          <div className="mx-auto max-w-[1400px] px-6">
            <div className="rounded-2xl bg-white p-8 shadow-sm lg:p-12">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid gap-8 lg:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      htmlFor="id-number"
                      className="block text-sm font-medium text-[#1b1f22]"
                    >
                      رقم الهوية الوطنية أو الإقامة أو رقم المنشأة
                    </label>
                    <input
                      type="text"
                      id="id-number"
                      value={idNumber}
                      onChange={(e) => {
                        setIdNumber(e.target.value);
                        if (errors.idNumber) {
                          setErrors({ ...errors, idNumber: "" });
                        }
                        if (formError) {
                          setFormError("");
                        }
                      }}
                      placeholder="برجاء أدخال رقم الهوية الوطنية أو الإقامة أو رقم المنشأة"
                      className={`h-14 w-full rounded-xl border px-4 text-base text-[#1b1f22] placeholder-gray-400 transition-all focus:bg-white focus:outline-none focus:ring-4 ${
                        errors.idNumber
                          ? "border-red-500 bg-[#f4f7fe]/50 focus:border-red-500 focus:ring-red-500/10"
                          : "border-gray-200 bg-[#f4f7fe]/50 focus:border-[#0038FF] focus:ring-[#0038FF]/10"
                      }`}
                    />
                    {errors.idNumber && (
                      <p className="text-sm text-red-500">{errors.idNumber}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="serial-number"
                      className="block text-sm font-medium text-[#1b1f22]"
                    >
                      الرقم التسلسلي
                    </label>
                    <input
                      type="text"
                      id="serial-number"
                      value={serialNumber}
                      onChange={(e) => {
                        setSerialNumber(e.target.value);
                        if (errors.serialNumber) {
                          setErrors({ ...errors, serialNumber: "" });
                        }
                        if (formError) {
                          setFormError("");
                        }
                      }}
                      placeholder="برجاء أدخال الرقم التسلسلي"
                      className={`h-14 w-full rounded-xl border px-4 text-base text-[#1b1f22] placeholder-gray-400 transition-all focus:bg-white focus:outline-none focus:ring-4 ${
                        errors.serialNumber
                          ? "border-red-500 bg-[#f4f7fe]/50 focus:border-red-500 focus:ring-red-500/10"
                          : "border-gray-200 bg-[#f4f7fe]/50 focus:border-[#0038FF] focus:ring-[#0038FF]/10"
                      }`}
                    />
                    {errors.serialNumber && (
                      <p className="text-sm text-red-500">{errors.serialNumber}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-center pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-14 min-w-[240px] rounded-xl bg-[#0038FF] px-8 text-base font-bold text-white transition-all hover:bg-[#0030dd] hover:shadow-lg hover:shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "جاري المعالجة..." : "انقر هنا لتحميل الملف"}
                  </button>
                </div>
                {formError && (
                  <p className="text-center text-sm text-red-500">{formError}</p>
                )}
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-[1400px] px-6">
          {/* Main footer content */}
          <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
            {/* الأفراد */}
            <div>
              <h3 className="text-lg font-bold text-gray-900">الأفراد</h3>
              <ul className="mt-6 space-y-3">
                <li>
                  <a
                    href="https://www.alrajhibank.com.sa/Personal/Accounts"
                    className="text-sm text-gray-700 hover:text-gray-900"
                  >
                    الحسابات
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.alrajhibank.com.sa/Personal/Cards"
                    className="text-sm text-gray-700 hover:text-gray-900"
                  >
                    البطاقات
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.alrajhibank.com.sa/Personal/Finance"
                    className="text-sm text-gray-700 hover:text-gray-900"
                  >
                    التمويل
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.alrajhibank.com.sa/Personal/Insurance"
                    className="text-sm text-gray-700 hover:text-gray-900"
                  >
                    التأمين
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.alrajhibank.com.sa/Personal/Offers/CardsOffers"
                    className="text-sm text-gray-700 hover:text-gray-900"
                  >
                    العروض
                  </a>
                </li>
              </ul>
            </div>

            {/* الأعمال */}
            <div>
              <h3 className="text-lg font-bold text-gray-900">الأعمال</h3>
              <ul className="mt-6 space-y-3">
                <li>
                  <a
                    href="https://www.alrajhibank.com.sa/Business/Cash-Management"
                    className="text-sm text-gray-700 hover:text-gray-900"
                  >
                    إدارة النقد
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.alrajhibank.com.sa/Business/Finance"
                    className="text-sm text-gray-700 hover:text-gray-900"
                  >
                    التمويل
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.alrajhibank.com.sa/Business/Insurance"
                    className="text-sm text-gray-700 hover:text-gray-900"
                  >
                    التأمين
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.alrajhibank.com.sa/Business/Trade"
                    className="text-sm text-gray-700 hover:text-gray-900"
                  >
                    التجارة
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.alrajhibank.com.sa/Business/Cards"
                    className="text-sm text-gray-700 hover:text-gray-900"
                  >
                    البطاقات
                  </a>
                </li>
              </ul>
            </div>

            {/* عن مصرف الراجحي */}
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                عن مصرف الراجحي
              </h3>
              <ul className="mt-6 space-y-3">
                <li>
                  <a
                    href="https://www.alrajhibank.com.sa/About-alrajhi-bank"
                    className="text-sm text-gray-700 hover:text-gray-900"
                  >
                    نبذه عن المصرف
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.alrajhibank.com.sa/About-alrajhi-bank/Investor-Relations/AGM"
                    className="text-sm text-gray-700 hover:text-gray-900"
                  >
                    اجتماعات الجمعية العمومية
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.alrajhibank.com.sa/About-alrajhi-bank/Investor-Relations"
                    className="text-sm text-gray-700 hover:text-gray-900"
                  >
                    علاقات المستثمرين
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.alrajhibank.com.sa/About-alrajhi-bank/Investor-Relations/Basel-Disclosure"
                    className="text-sm text-gray-700 hover:text-gray-900"
                  >
                    افصاحات بازل
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.alrajhibank.com.sa/About-alrajhi-bank/Media-Center"
                    className="text-sm text-gray-700 hover:text-gray-900"
                  >
                    المركز الإعلامي
                  </a>
                </li>
                <li>
                  <a
                    href="https://careers.alrajhibank.com.sa/ar/"
                    className="text-sm text-gray-700 hover:text-gray-900"
                  >
                    الوظائف
                  </a>
                </li>
              </ul>
            </div>

            {/* الدعم والمساعدة */}
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                الدعم والمساعدة
              </h3>
              <ul className="mt-6 space-y-3">
                <li>
                  <a
                    href="https://objectstorage.me-jeddah-1.oraclecloud.com/n/ax0k7s74wvl7/b/Marketing_Email_Images/o/Customer%20protection%20principles%20Ar.pdf"
                    className="text-sm text-gray-700 hover:text-gray-900"
                  >
                    مبادئ وقواعد حماية العملاء
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.alrajhibank.com.sa/Personal/Accounts/Products-And-Services-Fees"
                    className="text-sm text-gray-700 hover:text-gray-900"
                  >
                    التعرفة البنكية
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.alrajhibank.com.sa/forms/submit-your-request"
                    className="text-sm text-gray-700 hover:text-gray-900"
                  >
                    لرفع طلب أو شكوى
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.alrajhibank.com.sa/find-branch"
                    className="text-sm text-gray-700 hover:text-gray-900"
                  >
                    ابحث عن الفرع الأقرب لك
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer middle section */}
          <div className="border-t border-gray-200 py-8">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
              {/* Logo and accessibility */}
              <div className="flex items-center gap-6">
                <img
                  src="https://www.alrajhibank.com.sa/-/media/Project/AlRajhi/ARBRevamp/Temp/AlRajhiBankLogo.svg?h=53&iar=0&w=155&hash=CDCB0DBCE8B0FB5F773D371AC48A083E"
                  alt="مصرف الراجحي"
                  className="h-12 w-auto"
                />
                <button className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-300 text-sm font-bold text-gray-900">
                  AA
                </button>
              </div>

              {/* Footer links */}
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-700">
                <a
                  href="https://www.alrajhibank.com.sa/find-branch"
                  className="hover:text-gray-900"
                >
                  الفروع وأجهزة الصراف الآلي
                </a>
                <span className="text-gray-400">|</span>
                <a
                  href="https://www.alrajhibank.com.sa/Business/Finance/Employer-Onboarding"
                  className="hover:text-gray-900"
                >
                  بوابة اعتماد الجهات
                </a>
                <span className="text-gray-400">|</span>
                <a
                  href="https://www.alrajhibank.com.sa/About-alrajhi-bank/Fraud-Awareness"
                  className="hover:text-gray-900"
                >
                  الوعي ضد الاحتيال
                </a>
                <span className="text-gray-400">|</span>
                <a
                  href="https://www.alrajhibank.com.sa/Personal/Programs/Partnership-Program"
                  className="hover:text-gray-900"
                >
                  برنامج الشراكات
                </a>
                <span className="text-gray-400">|</span>
                <a
                  href="https://www.alrajhibank.com.sa/SiteMap"
                  className="hover:text-gray-900"
                >
                  خريطة الموقع
                </a>
                <span className="text-gray-400">|</span>
                <a
                  href="https://www.alrajhibank.com.sa/About-alrajhi-bank/Vendors"
                  className="hover:text-gray-900"
                >
                  الموردون
                </a>
                <span className="text-gray-400">|</span>
                <a
                  href="https://www.alrajhibank.com.sa/About-alrajhi-bank/Governance"
                  className="hover:text-gray-900"
                >
                  الحوكمة
                </a>
                <span className="text-gray-400">|</span>
                <a
                  href="https://www.alrajhibank.com.sa/About-alrajhi-bank/Compliance"
                  className="hover:text-gray-900"
                >
                  الإلتزام
                </a>
                <span className="text-gray-400">|</span>
                <a
                  href="https://www.alrajhibank.com.sa/About-alrajhi-bank/Corporate-Social-Responsibility"
                  className="hover:text-gray-900"
                >
                  المسؤولية الاجتماعية
                </a>
              </div>
            </div>
          </div>

          {/* Contact information */}
          <div className="border-t border-gray-200 py-8">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Phone numbers */}
              <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    الهاتف التسويقي
                  </p>
                  <a
                    href="tel:8001241222"
                    className="text-sm text-gray-700 hover:text-gray-900"
                  >
                    800-124-1222
                  </a>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    العناية بالعملاء
                  </p>
                  <a
                    href="tel:920003344"
                    className="text-sm text-gray-700 hover:text-gray-900"
                  >
                    920-003-344
                  </a>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    الرقم المجاني للبلاغات والشكاوى
                  </p>
                  <a
                    href="tel:8001244455"
                    className="text-sm text-gray-700 hover:text-gray-900"
                  >
                    800-124-4455
                  </a>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    الرقم المجاني
                  </p>
                  <a
                    href="tel:8001010150"
                    className="text-sm text-gray-700 hover:text-gray-900"
                  >
                    800-101-0150
                  </a>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    لرفع طلب أو شكوى
                  </p>
                  <a
                    href="https://www.alrajhibank.com.sa/forms/submit-your-request"
                    className="text-sm text-gray-700 hover:text-gray-900"
                  >
                    care@alrajhibank.com.sa
                  </a>
                </div>
              </div>

              {/* Company info */}
              <div className="text-xs leading-relaxed text-gray-600">
                شركة الراجحي المصرفية للاستثمار، نوع الكيان: مصرف / مؤسسة مالية،
                شركة سعودية مساهمة برأس مال: 40,000,000,000.00 § ، رقم السجل
                التجاري: 1010000096، صندوق بريد: 28 الرياض 11411 المملكة العربية
                السعودية، هاتف: 0096611211600، العنوان الوطني: شركة الراجحي
                المصرفية للاستثمار، 8467 طريق الملك فهد-حي المروج، وحدة رقم (1)،
                الرياض، 122630 – 2743 ، الموقع الإلكتروني: www.alrajhibank.com.sa
                ، مرخص لها برقم الترخيص: 1420 ، وخاضعة لرقابة وإشراف البنك
                المركزي السعودي
              </div>
            </div>
          </div>

          {/* Footer bottom */}
          <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 py-6 text-xs text-gray-600 md:flex-row">
            <p>حقوق الطبع والنشر ©2026 مصرف الراجحي.</p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://www.alrajhibank.com.sa/About-alrajhi-bank/Cookie-Policy"
                className="hover:text-gray-900"
              >
                سياسة ملفات تعريف الارتباط
              </a>
              <span className="text-gray-400">|</span>
              <a
                href="https://www.alrajhibank.com.sa/About-alrajhi-bank/privacy-policy"
                className="hover:text-gray-900"
              >
                سياسة الخصوصية
              </a>
              <span className="text-gray-400">|</span>
              <a
                href="https://www.alrajhibank.com.sa/About-alrajhi-bank/Terms-and-Conditions"
                className="hover:text-gray-900"
              >
                الأحكام والشروط
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
