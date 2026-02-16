"use client";

import { useEffect, useState } from "react";

type DocumentMapping = {
  idNumber: string;
  serialNumber: string;
  fileUrl: string;
  fileName: string;
  createdAt: string;
};

export default function AdminDashboard() {
  const [idNumber, setIdNumber] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [editTarget, setEditTarget] = useState<{
    idNumber: string;
    serialNumber: string;
  } | null>(null);
  const [errors, setErrors] = useState({
    idNumber: "",
    serialNumber: "",
    file: "",
  });
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mappings, setMappings] = useState<DocumentMapping[]>([]);
  const isEditMode = Boolean(editTarget);

  const loadMappings = async () => {
    try {
      const response = await fetch("/api/document-mappings");
      if (!response.ok) {
        throw new Error("Failed to load mappings.");
      }
      const data = (await response.json()) as DocumentMapping[];
      setMappings(data);
    } catch (error) {
      console.error(error);
      setStatusMessage("تعذر تحميل البيانات الحالية.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMappings();
  }, []);

  const resetForm = () => {
    setIdNumber("");
    setSerialNumber("");
    setFile(null);
    setEditTarget(null);
    setErrors({ idNumber: "", serialNumber: "", file: "" });
  };

  const startEdit = (mapping: DocumentMapping) => {
    setIdNumber(mapping.idNumber);
    setSerialNumber(mapping.serialNumber);
    setFile(null);
    setErrors({ idNumber: "", serialNumber: "", file: "" });
    setStatusMessage("");
    setEditTarget({
      idNumber: mapping.idNumber,
      serialNumber: mapping.serialNumber,
    });
  };

  const formatDate = (isoDate: string) => {
    const parsed = new Date(isoDate);
    if (Number.isNaN(parsed.getTime())) {
      return isoDate;
    }
    return new Intl.DateTimeFormat("ar-SA", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(parsed);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatusMessage("");

    const nextErrors = {
      idNumber: "",
      serialNumber: "",
      file: "",
    };

    if (!idNumber.trim()) {
      nextErrors.idNumber = "رقم الهوية مطلوب.";
    }
    if (!serialNumber.trim()) {
      nextErrors.serialNumber = "الرقم التسلسلي مطلوب.";
    }
    if (!file && !isEditMode) {
      nextErrors.file = "يرجى اختيار ملف PDF.";
    }

    setErrors(nextErrors);

    if (nextErrors.idNumber || nextErrors.serialNumber || nextErrors.file) {
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("idNumber", idNumber.trim());
      formData.append("serialNumber", serialNumber.trim());
      if (file) {
        formData.append("file", file);
      }
      if (editTarget) {
        formData.append("currentIdNumber", editTarget.idNumber);
        formData.append("currentSerialNumber", editTarget.serialNumber);
      }

      const response = await fetch("/api/document-mappings", {
        method: isEditMode ? "PUT" : "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorPayload = await response.json();
        throw new Error(errorPayload.message || "Upload failed.");
      }

      setStatusMessage(
        isEditMode
          ? "تم تحديث بيانات المستند بنجاح."
          : "تم رفع المستند وربطه بالبيانات بنجاح."
      );
      resetForm();
      await loadMappings();
    } catch (error) {
      console.error(error);
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "تعذر حفظ المستند. يرجى المحاولة مرة أخرى."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] px-4 py-10 text-[#1b1f22]">
      <div className="mx-auto flex max-w-4xl flex-col gap-8">
        <header className="rounded-2xl bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-[#002552]">
            لوحة التحكم - ربط المستندات
          </h1>
          <p className="mt-2 text-sm text-[#5b6770]">
            قم بتحميل المستند وربطه برقم الهوية والرقم التسلسلي ليتم تنزيله
            تلقائياً للمستخدمين.
          </p>
        </header>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-[#002552]">
              {isEditMode ? "تعديل بيانات مستند" : "إضافة مستند جديد"}
            </h2>
            {isEditMode && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-[#1b1f22] hover:bg-gray-50"
              >
                إلغاء التعديل
              </button>
            )}
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="admin-id-number"
                  className="block text-sm font-medium text-[#1b1f22]"
                >
                  رقم الهوية الوطنية / الإقامة / المنشأة
                </label>
                <input
                  id="admin-id-number"
                  type="text"
                  value={idNumber}
                  onChange={(event) => {
                    setIdNumber(event.target.value);
                    if (errors.idNumber) {
                      setErrors({ ...errors, idNumber: "" });
                    }
                  }}
                  placeholder="أدخل رقم الهوية"
                  className={`h-12 w-full rounded-xl border px-4 text-base text-[#1b1f22] transition-all focus:bg-white focus:outline-none focus:ring-4 ${
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
                  htmlFor="admin-serial-number"
                  className="block text-sm font-medium text-[#1b1f22]"
                >
                  الرقم التسلسلي
                </label>
                <input
                  id="admin-serial-number"
                  type="text"
                  value={serialNumber}
                  onChange={(event) => {
                    setSerialNumber(event.target.value);
                    if (errors.serialNumber) {
                      setErrors({ ...errors, serialNumber: "" });
                    }
                  }}
                  placeholder="أدخل الرقم التسلسلي"
                  className={`h-12 w-full rounded-xl border px-4 text-base text-[#1b1f22] transition-all focus:bg-white focus:outline-none focus:ring-4 ${
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

            <div className="space-y-2">
              <label
                htmlFor="admin-file"
                className="block text-sm font-medium text-[#1b1f22]"
              >
                ملف المستند (PDF)
                {isEditMode && (
                  <span className="mr-2 text-xs font-normal text-[#5b6770]">
                    (اختياري عند التعديل)
                  </span>
                )}
              </label>
              <input
                id="admin-file"
                type="file"
                accept="application/pdf"
                onChange={(event) => {
                  const selected = event.target.files?.[0] || null;
                  setFile(selected);
                  if (errors.file) {
                    setErrors({ ...errors, file: "" });
                  }
                }}
                className={`w-full rounded-xl border bg-[#f4f7fe]/50 px-4 py-3 text-sm transition-all focus:outline-none focus:ring-4 ${
                  errors.file
                    ? "border-red-500 focus:ring-red-500/10"
                    : "border-gray-200 focus:border-[#0038FF] focus:ring-[#0038FF]/10"
                }`}
              />
              {errors.file && <p className="text-sm text-red-500">{errors.file}</p>}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="h-12 w-full rounded-xl bg-[#0038FF] px-6 text-base font-bold text-white transition-all hover:bg-[#0030dd] hover:shadow-lg hover:shadow-blue-900/20 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {isSubmitting
                  ? "جاري الحفظ..."
                  : isEditMode
                    ? "حفظ التعديلات"
                    : "حفظ الربط"}
              </button>
              {statusMessage && (
                <span className="text-sm text-[#5b6770]">{statusMessage}</span>
              )}
            </div>
          </form>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#002552]">
              المستندات المرتبطة حالياً
            </h2>
            {isLoading && <span className="text-sm text-[#5b6770]">جاري التحميل</span>}
          </div>
          <div className="mt-6 space-y-4">
            {!isLoading && mappings.length === 0 && (
              <p className="text-sm text-[#5b6770]">
                لا توجد مستندات مرتبطة حتى الآن.
              </p>
            )}
            {mappings.map((mapping) => (
              <div
                key={`${mapping.idNumber}-${mapping.serialNumber}`}
                className="rounded-xl border border-gray-100 bg-[#f9fafb] p-4"
              >
                <div className="flex flex-col gap-2 text-sm text-[#1b1f22]">
                  <span>رقم الهوية: {mapping.idNumber}</span>
                  <span>الرقم التسلسلي: {mapping.serialNumber}</span>
                  <span>اسم الملف: {mapping.fileName}</span>
                  <span>آخر تحديث: {formatDate(mapping.createdAt)}</span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <a
                    href={mapping.fileUrl}
                    className="font-semibold text-[#0038FF] hover:underline"
                  >
                    تنزيل المستند
                  </a>
                  <button
                    type="button"
                    onClick={() => startEdit(mapping)}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-[#1b1f22] hover:bg-gray-100"
                  >
                    تعديل
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
