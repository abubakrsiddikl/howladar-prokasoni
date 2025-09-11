import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { useLocation } from "react-router";

export default function Footer() {
  const location = useLocation();

  if (
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/store-manager") ||
    location.pathname.startsWith("/user")
  ) {
    return null;
  }
  return (
    <footer className={"bg-gray-900 text-gray-200 pt-10"}>
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-4">যোগাযোগ</h3>
          <p className="flex items-center gap-2 mb-2">
            <FaMapMarkerAlt /> বাংলাবাজার, ঢাকা, বাংলাদেশ
          </p>
          <p className="flex items-center gap-2 mb-2">
            <FaPhoneAlt /> +880136582963 , +8801726956104
          </p>
          <p className="flex items-center gap-2 mb-2">
            <FaEnvelope /> info@howladarprokashoni.com
          </p>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold mb-4">সামাজিক মিডিয়া</h3>
          <div className="flex items-center gap-4">
            <a
              href="https://www.facebook.com/howladerprokashanioriginal"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500"
            >
              <FaFacebookF size={20} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-500"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400"
            >
              <FaLinkedinIn size={20} />
            </a>
          </div>
        </div>

        {/* About / Quick Info */}
        <div>
          <h3 className="text-lg font-semibold mb-4">হাওলাদার প্রকাশনী</h3>
          <p className="text-gray-400">
            আমরা সর্বশেষ বই ও প্রকাশনা সরবরাহ করি। আমাদের উদ্দেশ্য পাঠকদের কাছে
            মানসম্মত বই পৌঁছে দেওয়া।
          </p>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-8 border-t border-gray-700 pt-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} হাওলাদার প্রকাশনী | সর্বস্বত্ব
        সংরক্ষিত
      </div>
    </footer>
  );
}
