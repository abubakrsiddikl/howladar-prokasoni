import { useLocationData } from "@/hooks/useLocationData";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { shippingSchema, type ShippingFormType } from "@/ZodSchemas";

export default function ShippingForm({
  onSubmit,
  loading,
  disabled,
  totalAmount,
  defaultValues,
}: {
  onSubmit: (data: ShippingFormType) => void;
  defaultValues: ShippingFormType;
  loading: boolean;
  disabled: boolean;
  totalAmount: number;
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<ShippingFormType>({
    resolver: zodResolver(shippingSchema),
    defaultValues,
  });

  const { divisions, districts, cities, setDivision, setDistrict } =
    useLocationData();

  const division = watch("division");
  const district = watch("district");

  const handleDivisionChange = (value: string) => {
    setValue("division", value);
    setDivision(value);
    setValue("district", "");
    setValue("city", "");
  };

  const handleDistrictChange = (value: string) => {
    setValue("district", value);
    setDistrict(value);
    setValue("city", "");
  };

  return (
    <div className="bg-white p-5 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">ডেলিভারি ঠিকানা</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        {/* Name, Email, Phone */}
        <div className="flex flex-col md:flex-row gap-2">
          <div className="w-full">
            <label className="block mb-1">নাম</label>
            <input
              type="text"
              placeholder="আপনার নাম"
              {...register("name")}
              className="w-full border p-2 rounded"
            />
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="w-full">
            <label className="block mb-1">ইমেইল</label>
            <input
              type="email"
              placeholder="আপনার ইমেইল"
              {...register("email")}
              className="w-full border p-2 rounded"
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="w-full">
            <label className="block mb-1">মোবাইল নাম্বার</label>
            <input
              type="text"
              placeholder="মোবাইল নাম্বার"
              {...register("phone")}
              className="w-full border p-2 rounded"
            />
            {errors.phone && (
              <p className="text-red-500">{errors.phone.message}</p>
            )}
          </div>
        </div>

        {/* Division, District, City */}
        <div className="flex flex-col md:flex-row gap-2">
          <div className="w-full">
            <label className="block mb-1">বিভাগ</label>
            <select
              {...register("division")}
              className="w-full border p-2 rounded"
              onChange={(e) => handleDivisionChange(e.target.value)}
            >
              <option value="">বিভাগ নির্বাচন করুন</option>
              {divisions.map((div) => (
                <option key={div} value={div}>
                  {div}
                </option>
              ))}
            </select>
            {errors.division && (
              <p className="text-red-500">{errors.division.message}</p>
            )}
          </div>

          <div className="w-full">
            <label className="block mb-1">জেলা</label>
            <select
              {...register("district")}
              className="w-full border p-2 rounded"
              onChange={(e) => handleDistrictChange(e.target.value)}
              disabled={!division}
            >
              <option value="">জেলা নির্বাচন করুন</option>
              {districts.map((dist) => (
                <option key={dist} value={dist}>
                  {dist}
                </option>
              ))}
            </select>
            {errors.district && (
              <p className="text-red-500">{errors.district.message}</p>
            )}
          </div>

          <div className="w-full">
            <label className="block mb-1">উপজেলা/সিটি</label>
            <select
              {...register("city")}
              className="w-full border p-2 rounded"
              disabled={!district}
            >
              <option value="">উপজেলা নির্বাচন করুন</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            {errors.city && (
              <p className="text-red-500">{errors.city.message}</p>
            )}
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block mb-1">পূর্ণ ঠিকানা</label>
          <textarea
            placeholder="বাসা নং, রোড নং, এরিয়া..."
            {...register("address")}
            className="w-full border p-2 rounded"
          ></textarea>
          {errors.address && (
            <p className="text-red-500">{errors.address.message}</p>
          )}
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={disabled || loading}
          className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading
            ? "অর্ডারটি নিশ্চিত হচ্ছে ..."
            : `অর্ডারটি নিশ্চিত করুন ৳ ${totalAmount}`}
        </button>
      </form>
    </div>
  );
}
