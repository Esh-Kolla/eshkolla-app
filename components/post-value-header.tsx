export interface PostValueHeaderProps {
  productionTested?: boolean;
  codeAvailable?: boolean;
  warStory?: boolean;
  mentalModelShift?: boolean;
  readingTime: string;
}

export default function PostValueHeader({
  productionTested = false,
  codeAvailable = false,
  warStory = false,
  mentalModelShift = false,
  readingTime,
}: PostValueHeaderProps) {
  const valueSignals = [
    {
      visible: productionTested,
      icon: "⚙️",
      label: "Tested in production at Alvva",
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      visible: codeAvailable,
      icon: "💻",
      label: "Code you can copy-paste",
      color: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      visible: warStory,
      icon: "🔍",
      label: "Real debugging story",
      color: "bg-purple-50 text-purple-700 border-purple-200",
    },
    {
      visible: mentalModelShift,
      icon: "🧠",
      label: "This changed my thinking",
      color: "bg-amber-50 text-amber-700 border-amber-200",
    },
    {
      visible: true,
      icon: "⏱️",
      label: readingTime,
      color: "bg-gray-50 text-gray-600 border-gray-200",
    },
  ];

  const visibleSignals = valueSignals.filter((signal) => signal.visible);

  return (
    <div className="mb-8 flex flex-wrap gap-3">
      {visibleSignals.map((signal, index) => (
        <div
          key={index}
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${signal.color} text-sm font-medium`}
        >
          <span className="text-base">{signal.icon}</span>
          <span>{signal.label}</span>
        </div>
      ))}
    </div>
  );
}
