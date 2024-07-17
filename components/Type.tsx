const typeColors = {
 fire: "bg-red-600",
  grass: "bg-green-500",
  water: "bg-blue-500",
  electric: "bg-yellow-500",
  poison: "bg-purple-500",
  flying: "bg-orange-400",
  bug: "bg-yellow-900",
  fairy: "bg-rose-400",
  ground: "bg-green-900",
  fighting: "bg-amber-800",
  psychic: "bg-amber-200",
  steel: "bg-zinc-300",
  ghost: "bg-indigo-300",
  ice: "bg-indigo-100",
  rock: "bg-stone-700",
  normal: "bg-red-200",
  dark: "bg-stone-900",
  dragon: "bg-orange-700",
};

interface TypeProps {
  typeName: keyof typeof typeColors;
}

const Type: React.FC<TypeProps> = ({ typeName }) => {
  const bgColor = typeColors[typeName] || "bg-gray-500";
  return (
    <div
      className={`inline-block px-3 text-white rounded-md ${bgColor}`}
    >
      {typeName}
    </div>
  );
};

export default Type;
