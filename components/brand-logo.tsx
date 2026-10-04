import Image from "next/image";

export default function BrandLogo({
  priority = false,
}: {
  priority?: boolean;
}) {
  return (
    <span className="brand-logo">
      <Image
        src="/vode-logo.png"
        alt="VODE"
        width={500}
        height={500}
        priority={priority}
        unoptimized
      />
    </span>
  );
}
