import { format } from "date-fns";
import { CheckCircle } from "lucide-react";
import type { IOrder } from "@/types";

interface Props {
  order: Partial<IOrder>;
}

export default function OrderTimeline({ order }: Props) {
  // Reverse logs → latest first
  const reversedLogs = [...(order.orderStatusLog || [])].reverse();

  const isCurrentStatus = (idx: number) => idx === 0; // latest index

  return (
    <div className="bg-white p-3">
      <ul className="relative ml-6">
        {reversedLogs.map((log, idx) => {
          const isLast = idx === reversedLogs.length - 1;

          return (
            <li key={idx} className="relative flex gap-3 mb-6">
              {/* Timeline line */}
              {!isLast && (
                <span className="absolute left-3 top-6 w-[2px] h-full bg-[#ff8600]"></span>
              )}

              {/* Circle */}
              <span
                className={`relative z-10 flex items-center justify-center w-6 h-6 rounded-full bg-[#ff8600] text-white`}
              >
                {isCurrentStatus(idx) ? (
                  <CheckCircle className="w-4 h-4 text-white" />
                ) : (
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                )}
              </span>

              {/* Content */}
              <div>
                <h3 className="font-semibold text-sm text-[#ff8600]">
                  {log.status}
                </h3>
                <p className="text-xs text-gray-500">
                  {format(new Date(log.timestamp), "dd MMM yyyy, h:mm a")}
                </p>
                {log.note && (
                  <p className="text-sm text-gray-700 mt-1">{log.note}</p>
                )}
                {log.location && (
                  <p className="text-xs text-gray-500 mt-1">
                    📍 {log.location}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
