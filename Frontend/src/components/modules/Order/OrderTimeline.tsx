import { format } from "date-fns";
import { CheckCircle, Circle } from "lucide-react";
import type { IOrder, IOrderStatusLog } from "@/types";

interface Props {
  order: IOrder;
}

export default function OrderTimeline({ order }: Props) {
  // Reverse logs → latest first
  const reversedLogs = [...(order.orderStatusLog || [])].reverse();

  const isCurrentStatus = (idx: number) => idx === 0; // latest index

  const getStatusUI = (log: IOrderStatusLog, idx: number) => {
    if (isCurrentStatus(idx)) {
      return {
        icon: <CheckCircle className="w-4 h-4 text-white" />,
        bgColor: "bg-green-500",
        textColor: "text-green-700",
      };
    }
    return {
      icon: <Circle className="w-3 h-3 text-gray-500" />,
      bgColor: "bg-gray-300",
      textColor: "text-gray-700",
    };
  };

  return (
    <div className="bg-white p-3">
      <ul className="relative border-l border-gray-200">
        {reversedLogs.map((log, idx) => {
          const { icon, bgColor, textColor } = getStatusUI(log, idx);
          return (
            <li key={idx} className="flex items-center gap-3  ml-6 mb-5">
              {/* Circle */}
              <span
                className={` flex items-center justify-center w-6 h-6 rounded-full -left-3 ring-4 ring-white ${bgColor}`}
              >
                {icon}
              </span>

              {/* Content */}
              <div>
                <h3 className={`font-semibold text-sm ${textColor}`}>
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
