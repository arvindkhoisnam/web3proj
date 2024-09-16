import { cn } from "../lib/utils";

export default function CardDemo({
  title,
  imageUrl,
}: {
  title: string;
  imageUrl: string;
}) {
  return (
    <div className="max-w-xs w-full group">
      <div
        className={cn(
          "cursor-pointer overflow-hidden relative card size-32 sm:size-40 md:size-44 lg:size-56 rounded-md shadow-xl max-w-sm mx-auto flex flex-col justify-between p-4"
        )}
        style={{ backgroundImage: `url(${imageUrl})`, backgroundSize: "cover" }}
      >
        {/* Hover overlay */}
        <div className="absolute w-full h-full top-0 left-0 bg-black opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>

        <div className="flex flex-row items-center space-x-4 z-10">
          <div className="flex flex-col">
            <p className="font-normal text-base text-white relative">{title}</p>
          </div>
        </div>

        <div className="text content">
          <h1 className="text-xl md:text-2xl text-white relative z-10">
            {/* {title} */}
          </h1>
        </div>
      </div>
    </div>
  );
}
